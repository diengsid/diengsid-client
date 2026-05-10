"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import React, { useEffect, useState } from "react";
import { Rentable } from "../../schemas/schema-property";
import RoomCard from "./rentable-card";

interface Props {
  selectRentableId: string;
  rentables: Rentable[];
}
export default function RoomList({
  selectRentableId,
  rentables,
}: Props): React.ReactNode {
  const { setParams } = useQueryParams();

  const [selectedRentableId, setSelectedRentableId] = useState<string | null>(
    selectRentableId,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedRentableId(selectRentableId || null);
  }, [selectRentableId]);

  const handleSelect = (id: string) => {
    setSelectedRentableId(id);
    setParams({
      rentable_id: id,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rentables.map((rentable) => (
        <RoomCard
          key={rentable.id}
          rentable={rentable}
          selected={selectedRentableId === rentable.id}
          onSelect={() => handleSelect(rentable.id)}
        />
      ))}
    </div>
  );
}
