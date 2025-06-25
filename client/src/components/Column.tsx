import React from 'react';
import Cards from './Cards';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Column {
    _id: string;
    name: string;
}

interface ColumnProps extends Column {
  dndId: string;
}

export default function Column(props: ColumnProps) {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: props.dndId });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 100 : 'auto',
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleRename = async () => {
        const newName = prompt(t("Enter new column name"), props.name);
        if (newName && newName.trim() !== "" && newName !== props.name) {
            const token = localStorage.getItem('token') || "";
            if (!token) {
                alert(t("You are not logged in, please log in to rename a column."));
                return;
            }
            try {
                const response = await axios.put(
                    `http://localhost:1234/api/column/${props._id}`,
                    { name: newName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to rename column', error);
                alert(t("Failed to rename column"));
            }
        }
        setAnchorEl(null);
    };
    const handleMove = () => {
        setAnchorEl(null);
    };
    const handleRemove = async () => {
        const confirmed = window.confirm(t("Are you sure you want to remove this column?"));
        if (!confirmed) {
            setAnchorEl(null);
            return;
        }
        const token = localStorage.getItem('token') || "";
        if (!token) {
            alert(t("You are not logged in, please log in to remove a column."));
            setAnchorEl(null);
            return;
        }
        try {
            const response = await axios.delete(
            `http://localhost:1234/api/column/${props._id}`,
            {
                headers: {
                Authorization: `Bearer ${token}`
                }
            }
            );
            if (response.status === 200) {
            window.location.reload();
            }
        } catch (error) {
            console.error('Failed to remove column', error);
            alert(t("Failed to remove column"));
        }
        setAnchorEl(null);
    };

    // Logic to add a new card
    const addCard = async () => {
        console.log("Add Card clicked");
        const token = localStorage.getItem('token') || "";
        if (!token) {
            alert('You are not logged in, please log in to add a card.');
            return;
        }
        const newCard = {
            columnId: props._id,
            title: 'New Card',
            text: 'This is a new card'
        };
        try {
            const response = await axios.post('http://localhost:1234/api/card', newCard, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                console.log('Card added successfully:', response.data);
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to add card', error);
            alert('Failed to add card');
        }
    }

    return (
        <Suspense fallback={"Loading..."}>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{props.name}</h2>
                <h1 className="relative group">
                    <Button
                        id="column-options-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        ⋮
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                        }}
                    >
                        <MenuItem onClick={handleRename}>{t("Rename column")}</MenuItem>
                        <MenuItem onClick={handleMove}>{t("Move column")}</MenuItem>
                        <MenuItem onClick={handleRemove}>{t("Remove column")}</MenuItem>
                    </Menu>
                </h1>
            </div>
            <div id="cards-div" className="space-y-4 mb-4">
                <Cards _id={props._id}/>
            </div>
            <Button
            variant="contained"
            color="primary"
                onClick={addCard}>
                {t("Add Card")}
            </Button>
        </div>
        </Suspense>
    )
}