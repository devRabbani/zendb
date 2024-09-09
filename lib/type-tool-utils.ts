import validator from "validator";

export const analyzeType = (
  inputValue: string
): { suggestedType: string; alternatives?: string[] } => {
  // Trim the input and convert to lowercase for consistent checking
  const value = inputValue.trim().toLowerCase();

  // Check for empty string
  if (value === "") {
    return { suggestedType: "VARCHAR(1)" };
  }

  // Check for boolean
  if (["true", "false", "1", "0", "yes", "no", "y", "n"].includes(value)) {
    return {
      suggestedType: "BOOLEAN",
      alternatives: ["TINYINT(1)"],
    };
  }

  // Check for integer
  if (/^-?\d+$/.test(value)) {
    const num = parseInt(value, 10);
    if (num >= -128 && num <= 127) {
      return {
        suggestedType: "TINYINT",
        alternatives: ["SMALLINT", "INT"],
      };
    }
    if (num >= -32768 && num <= 32767) {
      return {
        suggestedType: "SMALLINT",
        alternatives: ["INT"],
      };
    }
    if (num >= -2147483648 && num <= 2147483647) {
      return {
        suggestedType: "INT",
        alternatives: ["BIGINT"],
      };
    }
    return { suggestedType: "BIGINT" };
  }

  // Check for floating point numbers
  if (/^-?\d*\.\d+$/.test(value)) {
    const [, fractional] = value.split(".");
    if (fractional.length <= 7) {
      return {
        suggestedType: "FLOAT",
        alternatives: ["DOUBLE", "DECIMAL"],
      };
    }
    return {
      suggestedType: "DOUBLE",
      alternatives: ["DECIMAL"],
    };
  }

  // Check for date and time
  if (validator.isISO8601(value)) {
    if (value.includes("T")) {
      return {
        suggestedType: "TIMESTAMP",
        alternatives: ["TIMESTAMPTZ", "DATETIME"],
      };
    }
    return { suggestedType: "DATE" };
  }
  if (validator.isTime(value)) {
    return { suggestedType: "TIME", alternatives: ["TIMETZ"] };
  }

  // Check for UUID
  if (validator.isUUID(value)) {
    return {
      suggestedType: "UUID",
      alternatives: ["VARCHAR(36)", "CHAR(36)"],
    };
  }

  // Check for email
  if (validator.isEmail(value)) {
    return {
      suggestedType: "VARCHAR(255)",
      alternatives: ["TEXT"],
    };
  }

  // Check for URL
  if (validator.isURL(value)) {
    return {
      suggestedType: "TEXT",
      alternatives: ["VARCHAR(2048)"],
    };
  }

  // Check for IP address
  if (validator.isIP(value)) {
    return { suggestedType: "VARCHAR(45)", alternatives: ["INET"] };
  }

  // Check for MAC address
  if (validator.isMACAddress(value)) {
    return { suggestedType: "MACADDR" };
  }

  // Check for CIDR
  if (
    /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))$/.test(value)
  ) {
    return { suggestedType: "CIDR" };
  }

  // Check for hexadecimal color
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    return {
      suggestedType: "CHAR(7)",
      alternatives: ["VARCHAR(7)"],
    };
  }

  // Check for ISBN
  if (validator.isISBN(value)) {
    return { suggestedType: "VARCHAR(17)" };
  }

  // Check for JSON and Array
  if (
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith("[") && value.endsWith("]"))
  ) {
    try {
      const parsed = JSON.parse(value.replace(/'/g, '"'));
      if (Array.isArray(parsed)) {
        if (parsed.every((item) => typeof item === "number")) {
          return {
            suggestedType: "NUMERIC[]",

            alternatives: ["INT[]", "FLOAT[]"],
          };
        }
        if (parsed.every((item) => typeof item === "string")) {
          return {
            suggestedType: "TEXT[]",

            alternatives: ["VARCHAR[]"],
          };
        }
        return {
          suggestedType: "JSONB",

          alternatives: ["JSON"],
        };
      }
      return { suggestedType: "JSONB", alternatives: ["JSON"] };
    } catch (e) {
      // Not a valid JSON or array, continue with other checks
    }
  }

  // For other strings, suggest VARCHAR or TEXT based on length
  const length = value.length;
  if (length <= 255) {
    return {
      suggestedType: `VARCHAR(${Math.max(length, Math.ceil(length * 1.2))})`,
      alternatives: ["TEXT"],
    };
  }
  if (length <= 65535) {
    return {
      suggestedType: "TEXT",
      alternatives: ["MEDIUMTEXT"],
    };
  }
  return {
    suggestedType: "LONGTEXT",
    alternatives: ["MEDIUMTEXT"],
  };
};
