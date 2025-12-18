

interface DropdownSection{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isDanger?: boolean;
  defaultOpen? :boolean;
  arrowDown?:boolean;
onToggle?:(oepn:boolean) => void;
}
export default DropdownSection;