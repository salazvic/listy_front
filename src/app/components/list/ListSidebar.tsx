import { ListActions } from "./ListActions";
import { ListHeader } from "./ListHeader";
import { ListUsers } from "./ListUsers";

export function ListSidebar({list}: {list: any}) {
  return (
    <div className="flex flex-col gap-6">
      <ListHeader 
        key={JSON.stringify(list?.items)}
        list={list}
      />
      <ListActions list={list} />
      <ListUsers list={list} />
    </div>
  )
}