import { useTranslation } from "react-i18next";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Card from "./Cards";
import Column from "./Column";
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
} from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

interface Card {
  _id: string;
  title: string;
  description: string;
}

interface Column {
  _id: string;
  name: string;
  cards: Card[];
}

interface DraggedColumn {
  _id: string;
  name: string;
  cards: Card[];
}

interface TargetColumn {
  _id: string;
  name: string;
  cards: Card[];
}

export default function Board() {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<Column[]>([]);
  const navigate = useNavigate();
  const { userEmail } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);

  // Function to add a new column
  const addColumn = async () => {
    const token = localStorage.getItem("token") || "";
    if (!loggedIn || !token) {
      alert("You are not logged in, redirecting to login page...");
      navigate("/login");
    }

    const newColumn = {
      name: "Brand New Column",
    };

    try {
      const response = await axios.post(
        "http://localhost:1234/api/column",
        newColumn,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status !== 201) {
        console.error("Failed to add column:", response);
        alert("Failed to add column");
        return;
      }
      setColumns([...columns, response.data]);
      // fetchColumns(token); // Refresh columns after adding a new one
    } catch (error) {
      console.error("Failed to add column", error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Handler for column drag end
  const handleColumnDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Find the dragged and target columns
    const draggedColumn: DraggedColumn | undefined = columns.find(
      (col) => col._id === active.id,
    );
    const targetColumn: TargetColumn | undefined = columns.find(
      (col) => col._id === over.id,
    );
    if (!draggedColumn || !targetColumn) return;
    // Call backend to swap/reorder columns
    try {
      const token: string = localStorage.getItem("token") || "";
      await axios.put(
        `http://localhost:1234/api/columns/${draggedColumn._id}`,
        {
          columnID: targetColumn._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Locally reorder columns for instant feedback
      const oldIndex: number = columns.findIndex(
        (col) => col._id === active.id,
      );
      const newIndex: number = columns.findIndex((col) => col._id === over.id);
      setColumns(arrayMove(columns, oldIndex, newIndex));
    } catch (error) {
      alert("Failed to reorder columns");
      console.error("Failed to reorder columns", error);
    }
  };

  // Check if user is logged in and fetch columns on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoggedIn(false);
      navigate("/login"); // TODO: user react navigation
      alert("You are not logged in, redirecting to login page...");
    } else {
      setLoggedIn(true);
      setIsViewingOtherUser(!!userEmail);
      
      // Function to fetch columns from the API
      const fetchColumns = async (token: string) => {
        try {
          const endpoint = userEmail 
            ? `http://localhost:1234/api/columns/${encodeURIComponent(userEmail)}`
            : "http://localhost:1234/api/columns";
            
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setColumns(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            if (error.status == 403) {
              alert("You do not have permission to access this resource.");
              return;
            } else if (error.status == 401) {
              setLoggedIn(false);
              navigate("/login"); // TODO: user react navigation
              alert("You are not logged in, redirecting to login page...");
              return;
            } else {
              console.error("Failed to fetch columns:", error.response);
            }
          } else {
            console.error("Failed to fetch columns:", error);
          }
        }
      };
      fetchColumns(token);
    }
  }, [setColumns, navigate, userEmail]);
  return (
    <Suspense fallback="loading">
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">
          {userEmail ? `${userEmail}'s Board` : t("kanban board")}
        </h1>
        {!isViewingOtherUser && (
          <button
            onClick={addColumn}
            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t("Add Column")}
          </button>
        )}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleColumnDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <Column key={column._id} {...column} dndId={column._id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Suspense>
  );
}
