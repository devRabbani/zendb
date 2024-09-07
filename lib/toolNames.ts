import {
  PiRuler,
  PiRulerFill,
  PiList,
  PiListFill,
  PiMagnifyingGlass,
  PiMagnifyingGlassFill,
  PiSliders,
  PiSlidersFill,
  PiGraph,
  PiGraphFill,
  PiLinkSimple,
  PiLinkSimpleFill,
} from "react-icons/pi";

const toolNames = [
  {
    name: "Char Length",
    path: "/",
    icon: PiRuler, // Normal icon
    activeIcon: PiRulerFill, // Active icon
  },
  {
    name: "Type Optimizer",
    path: "/type-optimizer",
    icon: PiList,
    activeIcon: PiListFill,
  },
  {
    name: "Index Analyzer",
    path: "/index-analyzer",
    icon: PiMagnifyingGlass,
    activeIcon: PiMagnifyingGlassFill,
  },
  {
    name: "Normalization",
    path: "/normalization",
    icon: PiSliders,
    activeIcon: PiSlidersFill,
  },
  {
    name: "Query Estimator",
    path: "/query-estimator",
    icon: PiGraph,
    activeIcon: PiGraphFill,
  },
  {
    name: "FK Visualizer",
    path: "/fk-visualizer",
    icon: PiLinkSimple,
    activeIcon: PiLinkSimpleFill,
  },
];

export default toolNames;
