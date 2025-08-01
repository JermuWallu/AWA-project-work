import { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import IconButton from "@mui/material/IconButton";
import CardEdit from "./CardEdit";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DragEndEvent as DndKitDragEndEvent } from "@dnd-kit/core";

// Utility function to format time in minutes to hours and minutes
const formatTime = (minutes: number): string => {
  if (minutes === 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

interface Card {
  _id: string;
  title: string;
  text: string;
  color: string;
  columnId: string;
  timeSpent?: number;
  timeCreated?: Date;
  timeUpdated?: Date;
}

interface Column {
  _id: string;
}

function SortableCard({
  card,
  onEdit,
}: {
  card: Card;
  onEdit: (card: Card) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : "auto",
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: card.color }}
      {...attributes}
      {...listeners}
      className="border border-gray-600 rounded p-4 relative"
    >
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-medium flex-1">{card.title}</h3>
        <div className="flex items-center mr-2">
          <AccessTimeIcon fontSize="small" className="mr-1 text-black" />
          <span className="text-sm text-black font-medium">
            {formatTime(card.timeSpent || 0)}
          </span>
        </div>
        <IconButton size="small" onClick={() => onEdit(card)} className="ml-2">
          <EditIcon fontSize="small" />
        </IconButton>
      </div>
      <hr className="mb-2" />
      <p>{card.text}</p>
      <div className="mt-2 text-xs text-gray-700">
        <div>
          Created:{" "}
          {card.timeCreated
            ? new Date(card.timeCreated).toLocaleString()
            : "N/A"}
        </div>
        <div>
          Updated:{" "}
          {card.timeUpdated
            ? new Date(card.timeUpdated).toLocaleString()
            : "N/A"}
        </div>
      </div>
    </div>
  );
}

export default function Cards(column: Column) {
  const [cards, setCards] = useState<Card[]>([]);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // Function to fetch cards for a specific column
  const fetchCards = async (columnId: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        console.error("No token found, user might not be logged in");
        return;
      }
      const response = await axios.get(
        `http://localhost:1234/api/cards/` + columnId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCards(response.data);
    } catch (error) {
      console.error("Failed to fetch cards", error);
    }
  };

  useEffect(() => {
    fetchCards(column._id);
  }, [column._id]);

  const handleEditClick = (card: Card) => {
    setEditingCard(card);
  };
  const handleEditClose = () => {
    setEditingCard(null);
  };
  const handleEditSave = (
    title: string,
    text: string,
    color: string,
    timeSpent: number,
  ) => {
    // Update the card in the local state after save
    // Note: doesn't use server data, assumes server will handle updates
    setCards((cards) =>
      cards.map((cardCurrent) =>
        cardCurrent._id === editingCard?._id
          ? {
              ...cardCurrent,
              title,
              text,
              color,
              timeSpent,
              timeUpdated: new Date(),
            }
          : cardCurrent,
      ),
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Card drag end handler
  const handleCardDragEnd = (event: DndKitDragEndEvent): void => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Convert id to string for comparison, as UniqueIdentifier can be string or number
    const activeId = String(active.id);
    const overId = String(over.id);

    const draggedCard: Card | undefined = cards.find((c) => c._id === activeId);
    const targetCard: Card | undefined = cards.find((c) => c._id === overId);

    // If both cards are in the same column, swap order
    if (
      draggedCard &&
      targetCard &&
      draggedCard.columnId === targetCard.columnId
    ) {
      const token: string = localStorage.getItem("token") || "";
      axios
        .put(
          `http://localhost:1234/api/card/swap`,
          {
            cardId: draggedCard._id,
            cardId2: targetCard._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          // Locally reorder for instant feedback
          const oldIndex: number = cards.findIndex((c) => c._id === activeId);
          const newIndex: number = cards.findIndex((c) => c._id === overId);
          setCards(arrayMove(cards, oldIndex, newIndex));
        })
        .catch(() => {
          alert("Failed to swap cards");
        });
    } else if (draggedCard && over) {
      // Moving card to another column
      const token: string = localStorage.getItem("token") || "";
      axios
        .put(
          `http://localhost:1234/api/card/${draggedCard._id}/move`,
          {
            columnId: column._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          // Remove from current list (will be fetched in parent refresh)
          setCards((cards) => cards.filter((c) => c._id !== draggedCard._id));
        })
        .catch(() => {
          alert("Failed to move card");
        });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleCardDragEnd}
    >
      <SortableContext
        items={cards.map((card) => card._id)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card) => (
          <SortableCard key={card._id} card={card} onEdit={handleEditClick} />
        ))}
      </SortableContext>
      {editingCard && (
        <CardEdit
          cardId={editingCard._id}
          initialTitle={editingCard.title}
          initialText={editingCard.text}
          initialColor={editingCard.color}
          initialTimeSpent={editingCard.timeSpent || 0}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </DndContext>
  );
}
