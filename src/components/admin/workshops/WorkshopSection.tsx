"use client";

import { useQueryState, debounce } from "nuqs";
import useDisclosure from "@/hooks/useDisclosure";
import { useState } from "react";
import WorkshopHeader from "./WorkshopHeader";
import WorkshopSearch from "./WorkshopSearch";
import WorkshopCard from "./WorkshopCard";
import WorkshopDialog from "./WorkshopDialog";
import { DialogMode } from "@/types/dialog";
import { Workshop } from "@/types/workshop";
import WorkshopDeleteDialog from "./WorkshopDeleteDialog";
import NotifyDialog from "@/components/admin/NotifyDialog";
import { useRouter } from "next/navigation";

type PropsType = {
  data: Workshop[];
  subscriberCount: number;
};

const WorkshopSection = ({ data, subscriberCount }: PropsType) => {
  const router = useRouter();
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    limitUrlUpdates: debounce(500),
    shallow: false,
  });

  const [editWorkshop, setEditWorkshop] = useState<null | Workshop>(null);
  const [deleteWorkshopTitle, setDeleteWorkshopTitle] = useState("");

  const {
    isOpen: isAddWorkshopOpen,
    onOpen: handleOpenAddWorkshopDialog,
    onClose: handleCloseAddWorkshopDialog,
  } = useDisclosure();

  const {
    isOpen: isEditWorkshopOpen,
    id: editWorkshopId,
    onOpen: handleOpenEditWorkshopDialog,
    onClose: handleCloseEditWorkshopDialog,
  } = useDisclosure();

  const {
    isOpen: isNotifyOpen,
    id: notifyWorkshopId,
    onOpen: handleOpenNotifyDialog,
    onClose: handleCloseNotifyDialog,
  } = useDisclosure();

  const {
    isOpen: isDeleteAlertOpen,
    id: deleteWorkshopId,
    onOpen: handleOpenDeleteAlert,
    onClose: handleCloseDeleteAlert,
  } = useDisclosure();

  const handleEditWorkshop = (workshopId: string) => {
    const workshop = data.find((w) => w.id === workshopId);
    if (!workshop) return;

    setEditWorkshop(() => {
      return {
        ...workshop,
        status: workshop.status,
      };
    });
    handleOpenEditWorkshopDialog(workshopId);
  };

  const handleDeleteWorkshop = (workshopId: string) => {
    const workshop = data.find((w) => w.id === workshopId);
    if (!workshop) return;

    setDeleteWorkshopTitle(workshop.title);
    handleOpenDeleteAlert(workshopId);
  };

  const notifyWorkshop = notifyWorkshopId
    ? data.find((w) => w.id === notifyWorkshopId)
    : undefined;

  const closeDialog = () => {
    handleCloseAddWorkshopDialog();
    handleCloseEditWorkshopDialog();
    setEditWorkshop(null);
  };

  const isFormDialogOpen = isAddWorkshopOpen || isEditWorkshopOpen;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <WorkshopHeader count={data.length} onAdd={handleOpenAddWorkshopDialog} />

      <WorkshopSearch value={search} onChange={setSearch} />

      {data.length === 0 ? (
        <div className="text-center py-20 text-gray text-[14px] tracking-wide">
          No workshops found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((workshop) => {
            return (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                onEdit={() => handleEditWorkshop(workshop.id)}
                onDelete={() => handleDeleteWorkshop(workshop.id)}
                onNotify={() => handleOpenNotifyDialog(workshop.id)}
              />
            );
          })}
        </div>
      )}

      {isFormDialogOpen && (
        <WorkshopDialog
          mode={editWorkshopId ? DialogMode.EDIT : DialogMode.ADD}
          editWorkshopId={editWorkshopId}
          initialData={editWorkshop}
          onClose={closeDialog}
        />
      )}

      {isNotifyOpen && notifyWorkshop && (
        <NotifyDialog
          target={{ type: "workshop", id: notifyWorkshop.id }}
          itemTitle={notifyWorkshop.title}
          subscriberCount={subscriberCount}
          lastNotifiedAt={notifyWorkshop.lastNotifiedAt}
          onClose={handleCloseNotifyDialog}
          onSent={router.refresh}
        />
      )}

      {isDeleteAlertOpen && (
        <WorkshopDeleteDialog
          workshopTitle={deleteWorkshopTitle}
          workshopId={deleteWorkshopId}
          onClose={() => {
            handleCloseDeleteAlert();
            setDeleteWorkshopTitle("");
          }}
        />
      )}
    </div>
  );
};

export default WorkshopSection;
