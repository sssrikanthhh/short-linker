"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { seedDatabase } from "@/actions/admin/seed-database";
import { Loader } from "lucide-react";

export function SeedDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    // Confirm before seeding
    if (
      !confirm(
        "Are you sure you want to seed the database with test data? This will add test users and URLs.",
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await seedDatabase();

      if (response.success) {
        toast.success("Database seeded", {
          description: "Test data has been added to the database.",
        });
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast.error("Error", {
          description: response.error || "Failed to seed database",
        });
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader className="mr-2 size-4 animate-spin" />
          Seeding...
        </>
      ) : (
        "Seed Database"
      )}
    </Button>
  );
}
