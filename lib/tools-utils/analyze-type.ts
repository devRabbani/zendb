import validator from "validator";
import type { TypeAnalysisResult } from "../types";

export const analyzeType = (inputValue: string): TypeAnalysisResult => {
  const value = inputValue.trim();
  const lowercaseValue = value.toLowerCase();

  // Check for empty string
  if (value === "") {
    return {
      suggestedType: "VARCHAR(1)",
      description:
        "An empty string. Consider using a NOT NULL constraint if this field is required.",
    };
  }

  // Check for boolean
  if (
    ["true", "false", "1", "0", "yes", "no", "y", "n"].includes(lowercaseValue)
  ) {
    return {
      suggestedType: "BOOLEAN",
      alternatives: ["TINYINT(1)"],
      description:
        "A boolean value. Use BOOLEAN for better semantic meaning, or TINYINT(1) for wider database compatibility.",
    };
  }

  // Check for integer
  if (/^-?\d+$/.test(value)) {
    const num = parseInt(value, 10);
    if (num >= -128 && num <= 127) {
      return {
        suggestedType: "TINYINT",
        alternatives: ["SMALLINT", "INT"],
        description:
          "A small integer between -128 and 127. TINYINT is the most space-efficient for this range.",
      };
    }
    if (num >= -32768 && num <= 32767) {
      return {
        suggestedType: "SMALLINT",
        alternatives: ["INT"],
        description:
          "A small integer between -32,768 and 32,767. SMALLINT balances space efficiency and range.",
      };
    }
    if (num >= -2147483648 && num <= 2147483647) {
      return {
        suggestedType: "INT",
        alternatives: ["BIGINT"],
        description:
          "An integer within the standard 32-bit range. INT is suitable for most integer use cases.",
      };
    }
    return {
      suggestedType: "BIGINT",
      description:
        "A large integer outside the 32-bit range. BIGINT can store very large numbers but uses more space.",
    };
  }

  // Check for floating point numbers
  if (/^-?\d*\.\d+$/.test(value)) {
    const [, fractional] = value.split(".");
    if (fractional.length <= 7) {
      return {
        suggestedType: "FLOAT",
        alternatives: ["DOUBLE", "DECIMAL"],
        description:
          "A floating-point number with up to 7 decimal places. FLOAT is suitable for most cases, but consider DECIMAL for financial calculations.",
      };
    }
    return {
      suggestedType: "DOUBLE",
      alternatives: ["DECIMAL"],
      description:
        "A floating-point number with high precision. DOUBLE provides more precision than FLOAT, but DECIMAL ensures exact representation.",
    };
  }

  // Check for date and time
  if (validator.isISO8601(value)) {
    if (value.includes("T")) {
      return {
        suggestedType: "TIMESTAMP",
        alternatives: ["TIMESTAMPTZ", "DATETIME"],
        description:
          "A date and time value. TIMESTAMP is compact and handles time zones well in most databases.",
      };
    }
    return {
      suggestedType: "DATE",
      description:
        "A date value without time information. DATE is suitable for birthdates, anniversaries, etc.",
    };
  }
  if (validator.isTime(value)) {
    return {
      suggestedType: "TIME",
      alternatives: ["TIMETZ"],
      description:
        "A time value without date information. Use TIME for storing only the time of day.",
    };
  }

  // Check for UUID
  if (validator.isUUID(value)) {
    return {
      suggestedType: "UUID",
      alternatives: ["VARCHAR(36)", "CHAR(36)"],
      description:
        "A Universally Unique Identifier. UUID type is preferred if supported by your database, otherwise use VARCHAR(36).",
    };
  }

  // Check for email
  if (validator.isEmail(value)) {
    return {
      suggestedType: "VARCHAR(255)",
      alternatives: ["TEXT"],
      description:
        "An email address. VARCHAR(255) is usually sufficient for email addresses.",
    };
  }

  // Check for URL
  if (validator.isURL(value)) {
    return {
      suggestedType: "TEXT",
      alternatives: ["VARCHAR(2048)"],
      description:
        "A URL. TEXT is flexible for varying lengths, but VARCHAR(2048) might be more efficient if URLs have a known maximum length.",
    };
  }

  // Check for IP address
  if (validator.isIP(value)) {
    return {
      suggestedType: "VARCHAR(45)",
      alternatives: ["INET"],
      description:
        "An IP address. VARCHAR(45) supports both IPv4 and IPv6. Use INET if your database supports it for better functionality.",
    };
  }

  // Check for MAC address
  if (validator.isMACAddress(value)) {
    return {
      suggestedType: "MACADDR",
      alternatives: ["CHAR(17)"],
      description:
        "A MAC address. Use MACADDR if your database supports it, otherwise CHAR(17) is suitable.",
    };
  }

  // Check for JSON and Array
  if (
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith("[") && value.endsWith("]"))
  ) {
    try {
      JSON.parse(value);
      return {
        suggestedType: "JSONB",
        alternatives: ["JSON"],
        description:
          "A JSON object or array. JSONB offers better performance and indexing capabilities than JSON in most databases.",
      };
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
      description: `A string of ${length} characters. VARCHAR with some buffer is efficient for shorter strings.`,
    };
  }
  if (length <= 65535) {
    return {
      suggestedType: "TEXT",
      alternatives: ["MEDIUMTEXT"],
      description:
        "A longer string. TEXT is suitable for strings up to 65,535 characters.",
    };
  }
  return {
    suggestedType: "LONGTEXT",
    alternatives: ["MEDIUMTEXT"],
    description: "A very long string. LONGTEXT can store up to 4GB of text.",
  };
};
