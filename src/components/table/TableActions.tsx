import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

type Props = {
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
};

const TableActions: React.FC<Props> = ({ onEdit, onDelete, onView }) => {
  return (
    <Box>
      {onView && (
        <Tooltip title="نمایش">
          <IconButton onClick={onView} color="primary">
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="ویرایش">
          <IconButton onClick={onEdit} color="info">
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="حذف">
          <IconButton onClick={onDelete} color="error">
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default TableActions;
