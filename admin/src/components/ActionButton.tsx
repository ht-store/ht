import { User, ProductResponse } from "../types";

interface ActionButtonsProps {
  item: any;
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  item,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <button className="px-2" onClick={() => onView(item)}>
        Xem
      </button>
      <button className="px-2" onClick={() => onEdit(item)}>
        Sửa
      </button>
      <button className="px-2" onClick={() => onDelete(item)}>
        Xóa
      </button>
    </div>
  );
};
