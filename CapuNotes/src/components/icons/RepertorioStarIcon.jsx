import { Star, StarFill } from "react-bootstrap-icons";

export default function RepertorioStarIcon({
  filled = false,
  size = 20,
  className = "",
  ...rest
}) {
  const Icon = filled ? StarFill : Star;
  return <Icon size={size} className={className} {...rest} />;
}
