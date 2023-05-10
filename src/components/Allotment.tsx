import { Allotment } from "allotment";

export default function AllotmentCmp({ children }) {
    return (
      <Allotment defaultSizes={[200, 100]}>
           {children}
      </Allotment>
    )
  }
  