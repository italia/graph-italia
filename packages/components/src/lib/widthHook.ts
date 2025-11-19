import { useState, useEffect } from "react";

export default function resizeHook(
  wrapRef: React.Ref<HTMLDivElement>,
  initialWidth = 250
) {
  const [width, setWidth] = useState<number>(initialWidth);

  function setDimension() {
    const dimension: number =
      (wrapRef as any).current.clientWidth || initialWidth;
    setWidth(dimension);
  }

  useEffect(() => {
    window.addEventListener("resize", setDimension);
    setDimension();
    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, []);

  return [width];
}
