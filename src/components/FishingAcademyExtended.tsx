// Extended Fishing Academy Components
// Techniques, Bait/Lures, Match the Hatch, PA Waters, Stocking, Regulations

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Search, MapPin, Calendar, Info, ExternalLink, Filter, Bug, Droplets, Wind, Sun } from "lucide-react";
import { pfbcService, type PFBCWaterBody, type PFBCStockingEvent } from "../services/pfbc";

// Fishing Techniques Component
export function FishingTechniques() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional Fishing Techniques */}
        <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎣 Traditional Fishing Techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TechniqueCard
              title="Still Fishing / Bottom Fishing"
              skill="Beginner"
              description="Cast and wait with bait on bottom. Great for panfish, catfish, trout in ponds."
              tips={[
                "Use enough weight to hold bottom",
                "Watch bobber or feel for bites",
                "Set hook with quick upward snap",
                "Good for beginners & kids"
              ]}
            />
            <TechniqueCard
              title="Bobber Fishing"
              skill="Beginner"
              description="Suspend bait at specific depth with float. Excellent for trout, panfish."
              tips={[
                "Adjust depth to where fish are",
                "Use smallest bobber possible",
                "Set hook when bobber goes under",
                "Perfect for streams and ponds"
              ]}
            />
            <TechniqueCard
              title="Casting & Retrieving Lures"
              skill="Intermediate"
              description="Active fishing with artificial lures. Works for bass, pike, trout."
              tips={[
                "Vary retrieve speed",
                "Try different lure actions",
                "Cover water systematically",
                "Match lure to target species"
              ]}
            />
            <TechniqueCard
              title="Jigging"
              skill="Intermediate"
              description="Vertical presentation with jigs. Effective for panfish, walleye, bass."
              tips={[
                "Use light jig heads (1/16 - 1/4 oz)",
                "Bounce bottom or suspend",
                "Feel for subtle bites",
                "Great in cold water"
              ]}
            />
          </CardContent>
        </Card>

        {/* Fly Fishing Techniques */}
        <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🪰 Fly Fishing Techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TechniqueCard
              title="Dry Fly Fishing"
              skill="Beginner"
              description="Presenting flies that float on surface. Classic trout fishing!"
              tips={[
                "Cast upstream, let drift naturally",
                "Mend line to avoid drag",
                "Strike when you see rise",
                "Use floatant on flies"
              ]}
            />
            <TechniqueCard
              title="Nymphing"
              skill="Intermediate"
              description="Fishing subsurface flies. Catches most trout!"
              tips={[
                "Use strike indicator or Euro style",
                "Dead drift is key",
                "Watch for subtle takes",
                "Fish near bottom"
              ]}
            />
            <TechniqueCard
              title="Streamer Fishing"
              skill="Intermediate"
              description="Swinging or stripping baitfish imitations. Big fish technique!"
              tips={[
                "Cast across & downstream",
                "Strip in erratic bursts",
                "Fish structure & deep pools",
                "Best in high/off-color water"
              ]}
            />
            <TechniqueCard
              title="Euronymphing"
              skill="Advanced"
              description="Modern tight-line nymphing. Incredibly effective!"
              tips={[
                "Long rod (10-11 ft)",
                "No indicator, watch leader",
                "High sticking technique",
                "Sensitive to strikes"
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Casting Tips */}
      <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50 backdrop-blur">
        <CardHeader>
          <CardTitle>🎯 Casting Tips for Youth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-white/60 rounded-xl">
              <h4 className="font-semibold mb-2">Spin Casting</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Hold rod at 10 o'clock</li>
                <li>Press button, bring to 1 o'clock</li>
                <li>Snap forward to 10 o'clock</li>
                <li>Release button at 11 o'clock</li>
                <li>Follow through</li>
              </ol>
            </div>
            <div className="p-3 bg-white/60 rounded-xl">
              <h4 className="font-semibold mb-2">Fly Casting</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Start with rod tip low</li>
                <li>Accelerate to 1 o'clock (back cast)</li>
                <li>Pause for line to straighten</li>
                <li>Accelerate to 10 o'clock (forward)</li>
                <li>Let line fall gently</li>
              </ol>
            </div>
            <div className="p-3 bg-white/60 rounded-xl">
              <h4 className="font-semibold mb-2">Practice Tips</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Practice in yard without hook</li>
                <li>✓ Use target (hula hoop)</li>
                <li>✓ Start with short casts</li>
                <li>✓ Focus on accuracy first</li>
                <li>✓ Get help from mentor</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TechniqueCard({ title, skill, description, tips }: any) {
  return (
    <div className="p-4 border rounded-xl bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <Badge variant="secondary" className="text-xs">{skill}</Badge>
      </div>
      <p className="text-sm text-slate-700 mb-3">{description}</p>
      <ul className="space-y-1">
        {tips.map((tip: string, i: number) => (
          <li key={i} className="text-xs text-slate-600 flex gap-2">
            <span className="text-blue-600">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Bait, Lures & Flies Component
export function BaitLuresFlies() {
  const [category, setCategory] = useState("bait");

  return (
    <div className="space-y-6">
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bait">🪱 Live Bait</TabsTrigger>
          <TabsTrigger value="lures">🎣 Lures</TabsTrigger>
          <TabsTrigger value="flies">🪰 Flies</TabsTrigger>
        </TabsList>

        <TabsContent value="bait" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BaitCard name="Nightcrawlers" species={["Trout", "Bass", "Panfish", "Catfish"]} season="Year-round" tips="Thread on hook, leave wiggling. Top choice for beginners!" />
            <BaitCard name="Red Worms" species={["Trout", "Panfish"]} season="Year-round" tips="Smaller than nightcrawlers. Great for trout in streams." />
            <BaitCard name="Minnows" species={["Bass", "Pike", "Walleye"]} season="Year-round" tips="Hook through lips or back. Lively action attracts predators." />
            <BaitCard name="Salmon Eggs" species={["Trout", "Steelhead"]} season="Spring/Fall" tips="Single egg or cluster on small hook. Deadly for stocked trout!" />
            <BaitCard name="PowerBait" species={["Trout"]} season="Year-round" tips="Moldable dough bait. Floats off bottom. Works great in ponds." />
            <BaitCard name="Crickets" species={["Panfish", "Trout"]} season="Summer" tips="Hook through collar. Irresistible to bluegill and sunfish." />
            <BaitCard name="Crayfish" species={["Bass", "Catfish"]} season="Spring/Summer" tips="Thread tail-first. Excellent for smallmouth bass." />
            <BaitCard name="Corn" species={["Carp", "Trout"]} season="Summer" tips="Cheap and effective! Check local regulations first." />
          </div>
        </TabsContent>

        <TabsContent value="lures" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LureCard name="Inline Spinner" size="1/8 - 1/4 oz" species={["Trout", "Bass", "Pike"]} retrieve="Steady retrieve, vary speed" color="Silver, gold, rainbow" />
            <LureCard name="Spoon" size="1/4 - 1/2 oz" species={["Trout", "Bass", "Pike"]} retrieve="Cast & retrieve, flutter on drop" color="Silver, gold, red/white" />
            <LureCard name="Jig & Plastic" size="1/16 - 1/4 oz" species={["Bass", "Panfish", "Walleye"]} retrieve="Bounce bottom, hop & pause" color="White, chartreuse, natural" />
            <LureCard name="Crankbait" size="2-3 inch" species={["Bass", "Pike", "Walleye"]} retrieve="Steady crank, pause occasionally" color="Shad, crawfish, perch" />
            <LureCard name="Soft Plastic Worm" size="4-6 inch" species={["Bass"]} retrieve="Texas rig, slow drag" color="Green pumpkin, watermelon" />
            <LureCard name="Rooster Tail" size="1/16 - 1/4 oz" species={["Trout", "Panfish"]} retrieve="Steady retrieve near surface" color="Yellow, white, black" />
          </div>
        </TabsContent>

        <TabsContent value="flies" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">🦟 Dry Flies (Surface)</h4>
              <div className="space-y-2">
                <FlyCard name="Adams" season="Spring-Fall" hatch="General mayfly" size="#12-18" />
                <FlyCard name="Elk Hair Caddis" season="Summer" hatch="Caddis" size="#12-16" />
                <FlyCard name="Parachute Adams" season="Year-round" hatch="Universal" size="#14-20" />
                <FlyCard name="Stimulator" season="Summer" hatch="Stonefly/Hopper" size="#8-14" />
                <FlyCard name="Blue Winged Olive" season="Spring/Fall" hatch="BWO mayfly" size="#18-22" />
                <FlyCard name="Royal Wulff" season="Summer" hatch="Attractor" size="#12-16" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">🐛 Nymphs (Subsurface)</h4>
              <div className="space-y-2">
                <FlyCard name="Pheasant Tail" season="Year-round" hatch="Mayfly nymph" size="#14-20" />
                <FlyCard name="Hare's Ear" season="Year-round" hatch="Universal" size="#12-18" />
                <FlyCard name="Copper John" season="Year-round" hatch="Mayfly" size="#14-20" />
                <FlyCard name="Prince Nymph" season="Year-round" hatch="Stonefly" size="#12-16" />
                <FlyCard name="Zebra Midge" season="Winter" hatch="Midge" size="#18-22" />
                <FlyCard name="Caddis Larva" season="Year-round" hatch="Caddis" size="#14-18" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">🐟 Streamers (Baitfish)</h4>
              <div className="space-y-2">
                <FlyCard name="Woolly Bugger" season="Year-round" hatch="Leech/baitfish" size="#6-12" />
                <FlyCard name="Muddler Minnow" season="Fall/Spring" hatch="Sculpin" size="#4-10" />
                <FlyCard name="Clouser Minnow" season="Year-round" hatch="Minnow" size="#6-10" />
                <FlyCard name="Zonker" season="Spring/Fall" hatch="Baitfish" size="#4-8" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">🦗 Terrestrials (Land Insects)</h4>
              <div className="space-y-2">
                <FlyCard name="Hopper" season="Summer/Fall" hatch="Grasshopper" size="#8-12" />
                <FlyCard name="Ant" season="Summer" hatch="Flying ant" size="#14-18" />
                <FlyCard name="Beetle" season="Summer" hatch="Beetle" size="#12-16" />
                <FlyCard name="Inchworm" season="Spring" hatch="Caterpillar" size="#12-16" />
              </div>
            </div>
          </div>

          <Card className="rounded-2xl border-2 border-green-200 bg-green-50 mt-6">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">🎣 Beginner's Fly Box (PA Trout Streams)</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Dry Flies (6-8 of each):</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Adams #14-16</li>
                    <li>• Elk Hair Caddis #14-16</li>
                    <li>• Stimulator #12-14</li>
                  </ul>
                </div>
                <div>
                  <strong>Nymphs (12 of each):</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Pheasant Tail #14-18</li>
                    <li>• Hare's Ear #14-16</li>
                    <li>• Copper John #16-18</li>
                  </ul>
                </div>
                <div>
                  <strong>Streamers (4-6 total):</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Woolly Bugger #8-10 (black, olive)</li>
                    <li>• Muddler Minnow #6-8</li>
                  </ul>
                </div>
                <div>
                  <strong>Extras:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Strike indicators</li>
                    <li>• Split shot weights</li>
                    <li>• Tippet (4X, 5X, 6X)</li>
                    <li>• Floatant & sinkant</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BaitCard({ name, species, season, tips }: any) {
  return (
    <Card className="rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <strong>Target:</strong> {species.join(", ")}
        </div>
        <div>
          <strong>Season:</strong> {season}
        </div>
        <div className="text-xs text-slate-600 italic">{tips}</div>
      </CardContent>
    </Card>
  );
}

function LureCard({ name, size, species, retrieve, color }: any) {
  return (
    <Card className="rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{name}</CardTitle>
        <CardDescription className="text-xs">{size}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <strong>Target:</strong> {species.join(", ")}
        </div>
        <div>
          <strong>Retrieve:</strong> {retrieve}
        </div>
        <div>
          <strong>Colors:</strong> {color}
        </div>
      </CardContent>
    </Card>
  );
}

function FlyCard({ name, season, hatch, size }: any) {
  return (
    <div className="p-3 border rounded-xl bg-white/60">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-semibold text-sm">{name}</h5>
          <div className="text-xs text-slate-600 mt-1">{hatch}</div>
        </div>
        <Badge variant="secondary" className="text-xs">{size}</Badge>
      </div>
      <div className="text-xs text-slate-500 mt-2">{season}</div>
    </div>
  );
}

// Match the Hatch Component
export function MatchTheHatch() {
  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-purple-200 bg-purple-50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🐛</div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What is "Match the Hatch"?</h3>
              <p className="text-sm text-slate-700">
                Fish eat what's naturally available! "Matching the hatch" means using flies or lures that imitate insects
                currently hatching or present in the water. This is THE KEY to successful fly fishing and why we study
                macroinvertebrates in TIC! When you can identify aquatic insects, you know what flies to use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PA Trout Stream Hatches */}
        <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>🗓️ PA Trout Stream Hatches by Season</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <HatchCalendar month="March-April" hatches={[
              { insect: "Blue Quill", fly: "Blue Quill #18-20", time: "Afternoon" },
              { insect: "Quill Gordon", fly: "Quill Gordon #14-16", time: "Afternoon" },
              { insect: "Early Black Stonefly", fly: "Black Stonefly #14-16", time: "Midday" }
            ]} />
            <HatchCalendar month="May" hatches={[
              { insect: "Hendrickson", fly: "Hendrickson #12-14", time: "Afternoon" },
              { insect: "March Brown", fly: "March Brown #10-12", time: "Afternoon" },
              { insect: "Sulphur", fly: "Sulphur #14-18", time: "Evening" },
              { insect: "Caddis (Grannom)", fly: "Elk Hair Caddis #14-16", time: "Afternoon" }
            ]} />
            <HatchCalendar month="June-July" hatches={[
              { insect: "Light Cahill", fly: "Light Cahill #12-16", time: "Evening" },
              { insect: "Pale Evening Dun", fly: "PED #16-18", time: "Dusk" },
              { insect: "Caddis", fly: "Elk Hair Caddis #14-18", time: "All day" },
              { insect: "Terrestrials", fly: "Hoppers, Ants #10-16", time: "Midday" }
            ]} />
            <HatchCalendar month="August-September" hatches={[
              { insect: "Trico", fly: "Trico #20-24", time: "Morning" },
              { insect: "Blue Winged Olive", fly: "BWO #18-22", time: "Afternoon" },
              { insect: "Grasshoppers", fly: "Hopper #8-12", time: "All day" },
              { insect: "Ants/Beetles", fly: "Ant #14-18", time: "All day" }
            ]} />
            <HatchCalendar month="October-November" hatches={[
              { insect: "Blue Winged Olive", fly: "BWO #18-22", time: "Afternoon" },
              { insect: "Midges", fly: "Midge #20-24", time: "Midday" },
              { insect: "October Caddis", fly: "Orange Stimulator #8-12", time: "Evening" }
            ]} />
          </CardContent>
        </Card>

        {/* Insect Identification Guide */}
        <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>🔬 Quick Insect ID Guide</CardTitle>
            <CardDescription>Connect to your TIC macro knowledge!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <InsectCard
              name="Mayflies (Ephemeroptera)"
              life="Nymph → Dun → Spinner"
              features="3 tails, upright wings, delicate"
              flies="Adams, Sulphur, BWO, Hendrickson"
              importance="CRITICAL - Trout's favorite food!"
            />
            <InsectCard
              name="Caddisflies (Trichoptera)"
              life="Larva (in case) → Pupa → Adult"
              features="Tent wings, antennae, erratic flight"
              flies="Elk Hair Caddis, X-Caddis, Caddis Larva"
              importance="Very common, year-round availability"
            />
            <InsectCard
              name="Stoneflies (Plecoptera)"
              life="Nymph → Adult"
              features="2 tails, flat wings, crawling"
              flies="Stimulator, Pat's Rubber Legs, Stonefly Nymph"
              importance="Indicates EXCELLENT water quality!"
            />
            <InsectCard
              name="Midges (Diptera)"
              life="Larva → Pupa → Adult"
              features="Tiny, mosquito-like, no tails"
              flies="Zebra Midge, Griffith's Gnat, Midge Pupa"
              importance="Winter fishing staple, abundant"
            />
            <InsectCard
              name="Terrestrials"
              life="Land insects that fall in water"
              features="Hoppers, ants, beetles, inchworms"
              flies="Hopper, Ant, Beetle, Inchworm"
              importance="Summer/fall - BIG fish eaters!"
            />
          </CardContent>
        </Card>
      </div>

      {/* Hatch Matching Strategy */}
      <Card className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 backdrop-blur">
        <CardHeader>
          <CardTitle>🎯 How to Match the Hatch (Step-by-Step)</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-sm">
              <strong>Observe the Water:</strong> Look for rising fish, floating insects, or insects flying near stream.
            </li>
            <li className="text-sm">
              <strong>Catch an Insect:</strong> Use a small net or your hand. Look at size, color, shape.
            </li>
            <li className="text-sm">
              <strong>Match Size First:</strong> Size is most important! Use a ruler or compare to fly boxes.
            </li>
            <li className="text-sm">
              <strong>Match Color Second:</strong> Dark vs. light, olive vs. tan vs. cream.
            </li>
            <li className="text-sm">
              <strong>Match Shape/Profile:</strong> Mayfly (upright wings) vs. Caddis (tent wings) vs. Stonefly (flat).
            </li>
            <li className="text-sm">
              <strong>Start with Close Match:</strong> Don't need perfect match! Close enough usually works.
            </li>
            <li className="text-sm">
              <strong>Adjust if Needed:</strong> If no strikes, try smaller size or different color.
            </li>
            <li className="text-sm">
              <strong>Use Your TIC Knowledge:</strong> Remember macroinvertebrate shapes from class!
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function HatchCalendar({ month, hatches }: any) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-blue-600" />
        {month}
      </h4>
      <div className="space-y-2">
        {hatches.map((h: any, i: number) => (
          <div key={i} className="text-xs p-2 bg-slate-50 rounded-lg">
            <div className="font-medium">{h.insect}</div>
            <div className="text-slate-600">
              Fly: {h.fly} • Best: {h.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsectCard({ name, life, features, flies, importance }: any) {
  return (
    <div className="p-3 border rounded-xl bg-gradient-to-br from-white to-slate-50">
      <h5 className="font-semibold text-sm mb-2">{name}</h5>
      <div className="space-y-1 text-xs text-slate-700">
        <div><strong>Life Cycle:</strong> {life}</div>
        <div><strong>Features:</strong> {features}</div>
        <div><strong>Flies to Use:</strong> {flies}</div>
        <div className="text-emerald-700 italic">{importance}</div>
      </div>
    </div>
  );
}

// PA Waters Explorer Component (placeholder for full implementation)
export function PAWatersExplorer() {
  const [waters, setWaters] = useState<PFBCWaterBody[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWaters() {
      setLoading(true);
      try {
        const data = await pfbcService.getWaters({
          county: selectedCounty !== "All" ? selectedCounty : undefined
        });
        setWaters(data);
      } catch (error) {
        console.error("Error loading waters:", error);
      } finally {
        setLoading(false);
      }
    }
    loadWaters();
  }, [selectedCounty]);

  const filteredWaters = waters.filter(water =>
    water.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    water.county.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paCounties = [
    "All", "Allegheny", "Beaver", "Butler", "Indiana", "Westmoreland",
    "Centre", "Clinton", "Lycoming", "Potter", "Tioga"
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">🗺️</div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Explore Pennsylvania Waters</h3>
              <p className="text-sm text-slate-700">
                Find streams, rivers, and lakes across PA. View access points, species, and regulations.
                Data sourced from PA Fish & Boat Commission.
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search waters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white"
              >
                {paCounties.map(county => (
                  <option key={county} value={county}>{county} County</option>
                ))}
              </select>
            </div>
          </div>

          {/* Waters List */}
          {loading ? (
            <div className="text-center py-8 text-slate-600">Loading waters...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {filteredWaters.map(water => (
                <WaterBodyCard key={water.id} water={water} />
              ))}
            </div>
          )}

          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <a href="https://pfbc.maps.arcgis.com/apps/webappviewer/index.html" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Official PFBC Map
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WaterBodyCard({ water }: { water: PFBCWaterBody }) {
  return (
    <Card className="rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {water.type === "stream" ? "🏞️" : water.type === "lake" ? "🏞️" : "🌊"}
          {water.name}
        </CardTitle>
        <CardDescription className="text-xs">
          {water.county} County • {water.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <strong>Species:</strong> {water.species.join(", ")}
        </div>
        <div>
          <strong>Access:</strong> {water.access}
        </div>
        {water.regulations && (
          <div className="text-xs text-slate-600 italic">
            {water.regulations}
          </div>
        )}
        {water.size && (
          <div className="text-xs text-slate-500">
            Size: {water.size}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Stocking Schedule Component
export function StockingSchedule() {
  const [stockingEvents, setStockingEvents] = useState<PFBCStockingEvent[]>([]);
  const [selectedCounty, setSelectedCounty] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStocking() {
      setLoading(true);
      try {
        const data = await pfbcService.getStockingSchedule({
          county: selectedCounty !== "All" ? selectedCounty : undefined
        });
        setStockingEvents(data);
      } catch (error) {
        console.error("Error loading stocking schedule:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStocking();
  }, [selectedCounty]);

  const paCounties = [
    "All", "Allegheny", "Beaver", "Butler", "Indiana", "Westmoreland",
    "Centre", "Clinton", "Lycoming", "Potter", "Tioga"
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2 border-green-200 bg-green-50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            PA Trout Stocking Schedule
          </CardTitle>
          <CardDescription>
            Real-time stocking data from PA Fish & Boat Commission
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* County Filter */}
          <div className="mb-4">
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border rounded-lg bg-white"
            >
              {paCounties.map(county => (
                <option key={county} value={county}>{county} County</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-600">Loading schedule...</div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {stockingEvents.map(event => (
                <Card key={event.id} className="rounded-xl border border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-green-800">{event.waterName}</h4>
                        <p className="text-sm text-slate-600">{event.county} County • {event.location}</p>
                        <div className="mt-2 flex items-center gap-3 text-sm">
                          <Badge className="bg-green-600">{event.species}</Badge>
                          <span className="text-slate-600">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          {event.amount && (
                            <span className="text-slate-600">{event.amount} fish</span>
                          )}
                        </div>
                      </div>
                      {event.coordinates && (
                        <Button size="sm" variant="outline" asChild>
                          <a 
                            href={`https://www.google.com/maps?q=${event.coordinates.lat},${event.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Map
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <a href="https://www.fishandboat.com/Fish/TroutStocking/Pages/default.aspx" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Official PFBC Stocking Schedule
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Regulations FAQ Component
export function RegulationsFAQ() {
  const faqs = [
    {
      q: "Do I need a fishing license in Pennsylvania?",
      a: "Youth under 16 fish FREE - no license needed! Ages 16+ need a PA fishing license. Trout/salmon permit also required to fish for or possess trout."
    },
    {
      q: "When is PA trout season?",
      a: "Regional Opening Day (usually first Saturday in April), then year-round in most waters. Catch and release only allowed during closed season on some streams."
    },
    // Continue with more FAQs...
  ];

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border-2 border-purple-200 bg-purple-50 backdrop-blur">
        <CardHeader>
          <CardTitle>📋 Youth-Friendly PA Fishing Regulations</CardTitle>
          <CardDescription>Simple answers to common questions</CardDescription>
        </CardHeader>
      </Card>

      {faqs.map((faq, i) => (
        <Card key={i} className="rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">{faq.q}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">{faq.a}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

