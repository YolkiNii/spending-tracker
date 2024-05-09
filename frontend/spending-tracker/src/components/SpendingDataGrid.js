// Source Code: https://mui.com/x/react-data-grid/editing/#full-featured-crud-component
import { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons
} from '@mui/x-data-grid';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const SPENDING_URL = '/spendings';

function EditToolbar(props) {
  const { rows, setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = rows[rows.length - 1].id + 1;
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', amount: '', isNew: true }
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
        Add Item
      </Button>
    </GridToolbarContainer>
  );
}

export default function SpendingDataGrid({ dbRows, doUpdate }) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  console.log('dbRows: ', dbRows);

  useEffect(() => {
    setRows([...dbRows]);
  }, [dbRows]);

  const handleDeleteSpending = useCallback(async (id) => {
    try {
      await axiosPrivate.delete(SPENDING_URL + `/${id}`);
    } catch (err) {
      console.log(err);
      return;
    }
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    try {
      await handleDeleteSpending(id);
    } catch (err) {
      console.log(err);
      return;
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = useCallback(
    async (newRow, oldRow) => {
      const newSpendingInfo = {
        name: newRow.name,
        note: newRow.note,
        amount: newRow.amount,
        spendingDate: newRow.spending_date.toISOString().split('T')[0]
      };

      // Post or Put new edit
      if (newRow.isNew) {
        try {
          await axiosPrivate.post(
            SPENDING_URL + `/${auth.username}`,
            JSON.stringify(newSpendingInfo)
          );
        } catch (err) {
          console.err(err);
          return;
        }
      } else {
        try {
          await axiosPrivate.put(
            SPENDING_URL + `/${oldRow.spending_id}`,
            JSON.stringify(newSpendingInfo)
          );
        } catch (err) {
          console.err(err);
          return;
        }
      }
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    [rows]
  );

  const handleProcessRowUpdateError = useCallback((error) => {
    console.log(error);
  }, []);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'amount', headerName: 'Amount', width: 150, editable: true },
    {
      field: 'spending_date',
      headerName: 'Date',
      type: 'date',
      width: 180,
      editable: true
    },
    {
      field: 'note',
      headerName: 'Note',
      width: 500,
      editable: true,
      sortable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />
        ];
      }
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      editMode='row'
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={handleProcessRowUpdateError}
      slots={{
        toolbar: EditToolbar
      }}
      slotProps={{
        toolbar: { rows, setRows, setRowModesModel }
      }}
    />
  );
}
