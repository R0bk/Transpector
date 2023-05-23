import { Allotment } from "allotment";
import React from "react";

export default function AllotmentWrapper({ children }: {children: React.ReactNode}) {
  return (
    <Allotment defaultSizes={[200, 100]} snap>
      {children}
    </Allotment>
  )
}