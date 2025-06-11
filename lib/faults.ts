import { supabase } from "./supabase";

export type FaultName = "disableAddToCart" | "jamPagination" | "fakeOutOfStock";

export interface FaultStatus {
  disableAddToCart: boolean;
  jamPagination: boolean;
  fakeOutOfStock: boolean;
}

interface FaultRecord {
  name: FaultName;
  is_enabled: boolean;
}

// Get current status of all faults
export async function getFaultStatus(): Promise<FaultStatus> {
  try {
    const { data, error } = await supabase
      .from("faults")
      .select("name, is_enabled");

    if (error) {
      console.error("Error fetching faults:", error);
      throw error;
    }

    console.log("Fetched fault data:", data);

    const faultMap = (data || []).reduce<Partial<Record<FaultName, boolean>>>(
      (acc, fault: FaultRecord) => ({
        ...acc,
        [fault.name]: fault.is_enabled,
      }),
      {}
    );

    console.log("Processed fault map:", faultMap);

    return {
      disableAddToCart: faultMap.disableAddToCart ?? false,
      jamPagination: faultMap.jamPagination ?? false,
      fakeOutOfStock: faultMap.fakeOutOfStock ?? false,
    };
  } catch (error) {
    console.error("Error fetching fault status:", error);
    return {
      disableAddToCart: false,
      jamPagination: false,
      fakeOutOfStock: false,
    };
  }
}

// Update a specific fault's status
export async function setFaultStatus(
  name: FaultName,
  isEnabled: boolean
): Promise<FaultStatus> {
  try {
    console.log(`Updating fault ${name} to ${isEnabled}`);

    // First verify the fault exists
    const { data: existingFault, error: checkError } = await supabase
      .from("faults")
      .select("name, is_enabled")
      .eq("name", name)
      .single();

    if (checkError) {
      console.error(`Error checking fault ${name}:`, checkError);
      throw new Error(`Fault ${name} not found`);
    }

    console.log("Existing fault state:", existingFault);

    // Perform the update
    const { data, error } = await supabase
      .from("faults")
      .update({
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq("name", name)
      .select();

    if (error) {
      console.error("Supabase error updating fault:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error("No rows were updated. Response:", { data, error });
      throw new Error(`Failed to update fault ${name}`);
    }

    console.log("Update response:", data);

    // Fetch the latest state
    return getFaultStatus();
  } catch (error) {
    console.error(`Error updating fault ${name}:`, error);
    throw error;
  }
}

// Check if a specific fault is enabled
export async function isFaultEnabled(name: FaultName): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("faults")
      .select("is_enabled")
      .eq("name", name)
      .single();

    if (error) throw error;

    return data?.is_enabled || false;
  } catch (error) {
    console.error(`Error checking fault ${name}:`, error);
    return false;
  }
}
