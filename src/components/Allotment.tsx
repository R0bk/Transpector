import { Allotment } from "allotment";
import React from "react";

export default function AllotmentCmp({ children }: {children: React.ReactNode}) {
    return (
      <Allotment defaultSizes={[200, 100]}>
           {children}
      </Allotment>
    )
  }
  