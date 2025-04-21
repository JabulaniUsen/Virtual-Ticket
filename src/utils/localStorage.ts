import { EventFormData } from "../types/event";

export const saveFormProgress = (data: Partial<EventFormData>) => {
  try {
    localStorage.setItem(
      "eventFormProgress",
      JSON.stringify({
        data,
        lastUpdated: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("Error saving form progress:", error);
  }
};

export const getFormProgress = (): Partial<EventFormData> | null => {
  try {
    const saved = localStorage.getItem("eventFormProgress");
    if (saved) {
      const { data, lastUpdated } = JSON.parse(saved);
      if (
        new Date().getTime() - new Date(lastUpdated).getTime() >
        24 * 60 * 60 * 1000
      ) {
        localStorage.removeItem("eventFormProgress");
        return null;
      }
      return data;
    }
  } catch (error) {
    console.error("Error getting form progress:", error);
  }
  return null;
};
