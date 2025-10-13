// PA Fish & Boat Commission API Integration Service
// Handles stocking schedules, waters database, events, and regulations

export interface StockingEvent {
  id: string;
  waterName: string;
  county: string;
  species: string;
  date: string;
  location: string;
  amount?: number;
  coordinates?: { lat: number; lng: number };
}

export interface WaterBody {
  id: string;
  name: string;
  type: "stream" | "river" | "lake" | "reservoir";
  county: string;
  species: string[];
  coordinates: { lat: number; lng: number };
  regulations?: string;
  access: string;
  size?: string;
  depth?: string;
}

export interface PFBCEvent {
  id: string;
  title: string;
  type: "training" | "stocking" | "education" | "volunteer";
  date: string;
  location: string;
  description: string;
  registrationUrl?: string;
}

class PFBCService {
  private baseUrl = "https://www.fishandboat.com/api"; // Placeholder - will need actual PFBC API

  /**
   * Fetch stocking schedule for a specific county or date range
   */
  async getStockingSchedule(params?: {
    county?: string;
    startDate?: string;
    endDate?: string;
    species?: string;
  }): Promise<StockingEvent[]> {
    try {
      // TODO: Replace with actual PFBC API call
      // For now, return demo data
      return this.getDemoStockingData();
    } catch (error) {
      console.error("Error fetching stocking schedule:", error);
      return this.getDemoStockingData();
    }
  }

  /**
   * Fetch Pennsylvania waters database
   */
  async getWaters(params?: {
    county?: string;
    type?: string;
    species?: string;
  }): Promise<WaterBody[]> {
    try {
      // TODO: Replace with actual PFBC API call
      return this.getDemoWatersData();
    } catch (error) {
      console.error("Error fetching waters:", error);
      return this.getDemoWatersData();
    }
  }

  /**
   * Fetch PFBC events and programs
   */
  async getEvents(params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<PFBCEvent[]> {
    try {
      // TODO: Replace with actual PFBC API call
      return this.getDemoEventsData();
    } catch (error) {
      console.error("Error fetching events:", error);
      return this.getDemoEventsData();
    }
  }

  /**
   * Search for a specific water body
   */
  async searchWaters(query: string): Promise<WaterBody[]> {
    const allWaters = await this.getWaters();
    return allWaters.filter(water =>
      water.name.toLowerCase().includes(query.toLowerCase()) ||
      water.county.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Demo data methods (replace with real API calls when available)
  
  private getDemoStockingData(): StockingEvent[] {
    return [
      {
        id: "1",
        waterName: "Negley Run",
        county: "Allegheny",
        species: "Brook Trout",
        date: "2025-04-15",
        location: "Washington Blvd Access",
        amount: 500,
        coordinates: { lat: 40.468, lng: -79.916 }
      },
      {
        id: "2",
        waterName: "North Park Lake",
        county: "Allegheny",
        species: "Rainbow Trout",
        date: "2025-04-01",
        location: "Boat Launch Area",
        amount: 2000,
        coordinates: { lat: 40.624, lng: -79.947 }
      },
      {
        id: "3",
        waterName: "Yellow Creek",
        county: "Indiana",
        species: "Brown Trout",
        date: "2025-04-10",
        location: "SR 422 Bridge",
        amount: 750,
        coordinates: { lat: 40.681, lng: -79.214 }
      },
      {
        id: "4",
        waterName: "Raccoon Creek",
        county: "Beaver",
        species: "Rainbow Trout",
        date: "2025-04-05",
        location: "State Park Access",
        amount: 1200,
        coordinates: { lat: 40.512, lng: -80.433 }
      },
      {
        id: "5",
        waterName: "Oil Creek",
        county: "Venango",
        species: "Brook Trout",
        date: "2025-04-20",
        location: "Drake Well Area",
        amount: 800,
        coordinates: { lat: 41.455, lng: -79.721 }
      }
    ];
  }

  private getDemoWatersData(): WaterBody[] {
    return [
      {
        id: "w1",
        name: "Negley Run",
        type: "stream",
        county: "Allegheny",
        species: ["Brook Trout", "Brown Trout"],
        coordinates: { lat: 40.468, lng: -79.916 },
        regulations: "Stocked Trout Waters - General Regulations",
        access: "Public - Washington Blvd, Highland Park",
        size: "Small urban stream"
      },
      {
        id: "w2",
        name: "North Park Lake",
        type: "lake",
        county: "Allegheny",
        species: ["Rainbow Trout", "Largemouth Bass", "Bluegill"],
        coordinates: { lat: 40.624, lng: -79.947 },
        regulations: "General lake fishing regulations",
        access: "Public - Multiple access points",
        size: "75 acres",
        depth: "Max 20 feet"
      },
      {
        id: "w3",
        name: "Slippery Rock Creek",
        type: "stream",
        county: "Butler/Lawrence",
        species: ["Brook Trout", "Brown Trout", "Smallmouth Bass"],
        coordinates: { lat: 41.064, lng: -80.122 },
        regulations: "Wild Trout Stream - Special Regulations",
        access: "Public - McConnells Mill State Park",
        size: "Medium to large stream"
      },
      {
        id: "w4",
        name: "Yellow Creek",
        type: "stream",
        county: "Indiana",
        species: ["Brown Trout", "Rainbow Trout"],
        coordinates: { lat: 40.681, lng: -79.214 },
        regulations: "Delayed Harvest Artificial Lures Only",
        access: "Public - Various township roads",
        size: "Medium stream"
      },
      {
        id: "w5",
        name: "Allegheny River",
        type: "river",
        county: "Multiple",
        species: ["Smallmouth Bass", "Walleye", "Muskie", "Trout"],
        coordinates: { lat: 40.442, lng: -79.996 },
        regulations: "General river regulations - varies by section",
        access: "Public - Numerous boat launches and shore access",
        size: "Major river"
      }
    ];
  }

  private getDemoEventsData(): PFBCEvent[] {
    return [
      {
        id: "e1",
        title: "Spring Trout Stocking Volunteer Day",
        type: "stocking",
        date: "2025-03-15",
        location: "Allegheny County Parks",
        description: "Help PFBC stock trout in local waters. Learn about fisheries management.",
        registrationUrl: "https://www.fishandboat.com/events"
      },
      {
        id: "e2",
        title: "Youth Fishing Skills Workshop",
        type: "education",
        date: "2025-04-20",
        location: "Moraine State Park",
        description: "Free workshop teaching basic fishing skills to youth ages 8-15",
        registrationUrl: "https://www.fishandboat.com/education"
      },
      {
        id: "e3",
        title: "Trout in the Classroom Teacher Training",
        type: "training",
        date: "2025-09-10",
        location: "Pleasant Gap PFBC Office",
        description: "Required training for new TIC teachers. Equipment setup, curriculum overview.",
        registrationUrl: "https://www.fishandboat.com/TIC"
      },
      {
        id: "e4",
        title: "Stream Cleanup Volunteer Day",
        type: "volunteer",
        date: "2025-05-15",
        location: "Various PA Streams",
        description: "Join PFBC and partners for statewide stream cleanup day",
        registrationUrl: "https://www.fishandboat.com/volunteer"
      }
    ];
  }
}

// Export singleton instance
export const pfbcService = new PFBCService();

// Export types
export type { StockingEvent as PFBCStockingEvent, WaterBody as PFBCWaterBody };

