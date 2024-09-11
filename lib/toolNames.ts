import {
  PiRulerFill,
  PiListFill,
  PiMagnifyingGlassFill,
  PiSlidersFill,
  PiGraphFill,
  PiRulerDuotone,
  PiListDuotone,
  PiMagnifyingGlassDuotone,
  PiSlidersDuotone,
  PiGraphDuotone,
  PiDatabaseDuotone,
  PiDatabaseFill,
  PiFlowArrowDuotone,
  PiFlowArrowFill,
} from "react-icons/pi";

const toolNames = [
  {
    name: "Char Length",
    path: "/",
    icon: PiRulerDuotone, // Normal icon
    activeIcon: PiRulerFill, // Active icon
  },
  {
    name: "Type Optimizer",
    path: "/type-optimizer",
    icon: PiListDuotone,
    activeIcon: PiListFill,
  },
  {
    name: "Index Analyzer",
    path: "/index-analyzer",
    icon: PiMagnifyingGlassDuotone,
    activeIcon: PiMagnifyingGlassFill,
  },
  {
    name: "Normalization",
    path: "/normalization",
    icon: PiSlidersDuotone,
    activeIcon: PiSlidersFill,
  },
  {
    name: "Query Estimator",
    path: "/query-estimator",
    icon: PiGraphDuotone,
    activeIcon: PiGraphFill,
  },
  {
    name: "ERD Generator",
    path: "/erd-generator",
    icon: PiFlowArrowDuotone,
    activeIcon: PiFlowArrowFill,
  },
  {
    name: "Schema Visualizer",
    path: "/schema-visualizer",
    icon: PiDatabaseDuotone,
    activeIcon: PiDatabaseFill,
  },
];

export default toolNames;
