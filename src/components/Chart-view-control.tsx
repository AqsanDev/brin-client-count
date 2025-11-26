"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Session } from "@/lib/config";
import { MapPin, Clock, Database } from "lucide-react";

export interface ChartViewControlProps {
  locations: string[];
  selectedLocation: string;
  selectedSession: Session;
  dataLimit: number | "all" | "custom";
  customLimit?: number;
  onLocationChange: (location: string) => void;
  onSessionChange: (session: Session) => void;
  onDataLimitChange: (limit: number | "all" | "custom") => void;
  onCustomLimitChange?: (limit: number) => void;
}

export function ChartViewControl({
  locations,
  selectedLocation,
  selectedSession,
  dataLimit,
  customLimit = 10,
  onLocationChange,
  onSessionChange,
  onDataLimitChange,
  onCustomLimitChange,
}: ChartViewControlProps) {
  const [showCustomInput, setShowCustomInput] = useState(dataLimit === "custom");
  const [customValue, setCustomValue] = useState(customLimit.toString());

  useEffect(() => {
    setShowCustomInput(dataLimit === "custom");
  }, [dataLimit]);

  const handleDataLimitChange = (value: string) => {
    if (value === "custom") {
      onDataLimitChange("custom");
      setShowCustomInput(true);
    } else if (value === "all") {
      onDataLimitChange("all");
      setShowCustomInput(false);
    } else {
      onDataLimitChange(parseInt(value, 10));
      setShowCustomInput(false);
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomValue(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && onCustomLimitChange) {
      onCustomLimitChange(numValue);
    }
  };

  const displayLocations = locations.length > 0 ? locations : ["No locations configured"];

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-muted/30 rounded-lg border">
      {/* Location Selector */}
      <div className="flex-1 min-w-[180px]">
        <Label htmlFor="location-select" className="text-xs font-medium text-muted-foreground mb-2 block">
          <MapPin className="inline w-3.5 h-3.5 mr-1" />
          Lokasi
        </Label>
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger id="location-select" className="w-full">
            <SelectValue placeholder="Pilih lokasi" />
          </SelectTrigger>
          <SelectContent>
            {displayLocations.map((location) => (
              <SelectItem key={location} value={location}>
                <span className="capitalize">{location}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Session Selector */}
      <div className="flex-1 min-w-[140px]">
        <Label htmlFor="session-select" className="text-xs font-medium text-muted-foreground mb-2 block">
          <Clock className="inline w-3.5 h-3.5 mr-1" />
          Sesi
        </Label>
        <Select value={selectedSession} onValueChange={onSessionChange}>
          <SelectTrigger id="session-select" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pagi">Pagi</SelectItem>
            <SelectItem value="siang">Siang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Limit Selector */}
      <div className="flex-1 min-w-[180px]">
        <Label htmlFor="limit-select" className="text-xs font-medium text-muted-foreground mb-2 block">
          <Database className="inline w-3.5 h-3.5 mr-1" />
          Jumlah Data
        </Label>
        <div className="flex gap-2">
          <Select value={dataLimit === "custom" ? "custom" : dataLimit === "all" ? "all" : dataLimit.toString()} onValueChange={handleDataLimitChange}>
            <SelectTrigger id="limit-select" className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 Data</SelectItem>
              <SelectItem value="20">20 Data</SelectItem>
              <SelectItem value="30">30 Data</SelectItem>
              <SelectItem value="all">Semua Data</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {showCustomInput && (
            <Input
              type="number"
              min="1"
              value={customValue}
              onChange={(e) => handleCustomInputChange(e.target.value)}
              placeholder="Jumlah"
              className="w-24"
            />
          )}
        </div>
      </div>
    </div>
  );
}
