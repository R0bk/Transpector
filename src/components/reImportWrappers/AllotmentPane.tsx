import { Allotment } from "allotment";
import React from "react";

export default function AllotmentPaneWrapper({ children, snap, minSize }: {children: React.ReactNode, snap?: boolean, minSize?: number}) {
  return (
    <Allotment.Pane minSize={minSize} snap={snap}>
      {children}
    </Allotment.Pane>
  )
}
    