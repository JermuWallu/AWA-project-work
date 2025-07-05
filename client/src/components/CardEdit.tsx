import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface CardEditProps {
  cardId: string;
  initialTitle: string;
  initialText: string;
  initialColor: string;
  initialTimeSpent?: number;
  onClose: () => void;
  onSave: (
    title: string,
    text: string,
    color: string,
    timeSpent: number,
  ) => void;
}

const colorOptions = [
  "#ffffff",
  "#f87171",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#d1d5db",
];

export default function CardEdit({
  cardId,
  initialTitle,
  initialText,
  initialColor,
  initialTimeSpent = 0,
  onClose,
  onSave,
}: CardEditProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const [color, setColor] = useState(initialColor);
  const [timeSpent, setTimeSpent] = useState(initialTimeSpent);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleColorClose = () => {
    setAnchorEl(null);
  };
  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
    setAnchorEl(null);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      await axios.put(
        `http://localhost:1234/api/card/${cardId}`,
        { title, text, color },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onSave(title, text, color, timeSpent);
      onClose();
    } catch {
      alert(t("Failed to save changes"));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Grid
        container
        direction="column"
        className="bg-white rounded-lg shadow-lg p-6 w-96"
        style={{ gridRowGap: 16 }}
      >
        <Typography variant="h6" className="mb-2">
          {t("Edit the card")}
        </Typography>
        <TextField
          label={t("Title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          className="mb-2"
        />
        <TextField
          label={t("Text")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          className="mb-2"
        />
        <TextField
          label={t("Time Spent (minutes)")}
          type="number"
          value={timeSpent}
          onChange={(e) =>
            setTimeSpent(Math.max(0, parseInt(e.target.value) || 0))
          }
          fullWidth
          className="mb-2"
          inputProps={{ min: 0 }}
          helperText={t("Enter time spent on this task in minutes")}
        />
        <div className="flex items-center mb-2">
          <span className="mr-2">{t("Color")}:</span>
          <Button
            variant="contained"
            style={{ backgroundColor: color, minWidth: 36, minHeight: 36 }}
            onClick={handleColorClick}
          />
          <Menu anchorEl={anchorEl} open={open} onClose={handleColorClose}>
            {colorOptions.map((c) => (
              <MenuItem key={c} onClick={() => handleColorSelect(c)}>
                <span
                  style={{
                    backgroundColor: c,
                    width: 24,
                    height: 24,
                    display: "inline-block",
                    borderRadius: 4,
                    border: c === color ? "2px solid #000" : "1px solid #ccc",
                  }}
                />
              </MenuItem>
            ))}
          </Menu>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          className="mb-2"
        >
          {t("Save changes")}
        </Button>
        <Button variant="text" color="secondary" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            if (
              window.confirm(t("Are you sure you want to remove this card?"))
            ) {
              try {
                const token = localStorage.getItem("token") || "";
                await axios.delete("http://localhost:1234/api/card/", {
                  headers: { Authorization: `Bearer ${token}` },
                  data: { cardId: cardId },
                });
                onClose();
                window.location.reload();
              } catch {
                alert(t("Failed to remove card"));
              }
            }
          }}
          className="mb-2"
        >
          {t("Remove card")}
        </Button>
      </Grid>
    </div>
  );
}
