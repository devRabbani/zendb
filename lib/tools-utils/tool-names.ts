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
    fullname: "Optimize Charater Length",
    path: "/char-length",
    icon: PiRulerDuotone, // Normal icon
    activeIcon: PiRulerFill, // Active icon
  },
  {
    name: "Schema Visualizer",
    fullname: "Schema Visualizer",
    path: "/schema-visualizer",
    icon: PiDatabaseDuotone,
    activeIcon: PiDatabaseFill,
  },
  {
    name: "Normalization",
    fullname: "Normalize Schema",
    path: "/normalization",
    icon: PiSlidersDuotone,
    activeIcon: PiSlidersFill,
  },
  {
    name: "Type Optimizer",
    fullname: "Optimize DB Type",
    path: "/type-optimizer",
    icon: PiListDuotone,
    activeIcon: PiListFill,
  },
  {
    name: "Index Analyzer",
    fullname: "Query Index Analyzer",
    path: "/index-analyzer",
    icon: PiMagnifyingGlassDuotone,
    activeIcon: PiMagnifyingGlassFill,
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
];

export default toolNames;
