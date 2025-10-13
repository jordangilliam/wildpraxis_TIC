// Brook - AI Conservation Assistant
// Inspired by WLA's Brook AI, tailored for TIC programs

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Loader2, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function BrookAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm Brook, your AI conservation assistant. I can help with trout care, water quality, watershed questions, and connecting you to PA conservation resources. What would you like to learn about?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulated AI responses based on common TIC questions
  // In production, this would call an actual AI API (Anthropic Claude, OpenAI, etc.)
  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = generateResponse(input);
    const assistantMessage: Message = {
      role: "assistant",
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setLoading(false);
  }

  function generateResponse(question: string): string {
    const q = question.toLowerCase();

    // Water Quality
    if (q.includes("ammonia") || q.includes("nitrite") || q.includes("nitrate")) {
      return "🧪 **Water Quality - Nitrogen Cycle**\n\nHere's what you need to know:\n\n• **Ammonia (NH3)**: Toxic to trout. Comes from fish waste and uneaten food. Should be 0 ppm.\n• **Nitrite (NO2-)**: Also toxic. Produced as beneficial bacteria break down ammonia. Should be 0 ppm.\n• **Nitrate (NO3-)**: Less toxic end product. Manage with partial water changes. Keep below 40 ppm.\n\n**If you're seeing high levels:**\n1. Stop feeding temporarily\n2. Do a 25% water change with dechlorinated water\n3. Check filter - is it running properly?\n4. Test again in 24 hours\n\nNeed specific help with test results? Share your numbers!";
    }

    if (q.includes("temperature") || q.includes("temp") || q.includes("cold")) {
      return "🌡️ **Temperature Management**\n\nTrout are coldwater fish and very sensitive to temperature:\n\n• **Ideal range**: 48-55°F (9-13°C)\n• **Acceptable**: 45-58°F\n• **Danger zone**: Above 60°F\n• **Lethal**: Above 65°F\n\n**Your chiller should:**\n- Run continuously\n- Be set to 50-52°F\n- Have good water circulation\n\n**If temp is rising:**\n- Check chiller is plugged in and running\n- Ensure room isn't too hot\n- Add ice in sealed container (emergency only)\n- Turn off tank lights\n\nMonitor temperature 2x daily!";
    }

    if (q.includes("feed") || q.includes("food") || q.includes("eating")) {
      return "🍽️ **Feeding Your Trout**\n\n**Timing:**\n- Wait for alevin yolk sacs to be absorbed (usually 2-4 weeks after hatch)\n- First 'swim-up' signals they're ready to eat\n\n**Amount:**\n- Start with tiny pinches\n- Feed only what they eat in 2-3 minutes\n- 2-3 times per day\n- Remove uneaten food after 5 minutes\n\n**Starter food:**\n- Use finely ground trout pellets or fry powder\n- High protein (45%+)\n\n**Common mistakes:**\n- Overfeeding (#1 problem!) causes ammonia spikes\n- Feeding too early while yolk sac present\n- Not removing uneaten food\n\nRemember: hungry trout are healthy trout!";
    }

    if (q.includes("macro") || q.includes("invertebrate") || q.includes("bugs") || q.includes("mayfly") || q.includes("stonefly")) {
      return "🔬 **Macroinvertebrates - Stream Health Indicators**\n\nMacros tell us about water quality:\n\n**Pollution Sensitive** (good sign!):\n• Mayflies (Ephemeroptera) - 3 tails, gills on sides\n• Stoneflies (Plecoptera) - 2 tails, prefer cold water\n• Caddisflies (Trichoptera) - often in cases\n\n**Somewhat Tolerant:**\n• Crayfish, scuds, dragonflies\n\n**Pollution Tolerant** (warning sign):\n• Aquatic worms, leeches\n• Midge larvae\n\nFind lots of mayflies and stoneflies? That stream can support trout!\n\n**Want to learn more?** Use the Macro ID tool in this app, or check out WildPraxis for field identification: https://wla-app.vercel.app/";
    }

    if (q.includes("watershed") || q.includes("stream") || q.includes("river") || q.includes("water cycle")) {
      return "🗺️ **Watersheds - Everything is Connected**\n\nA watershed is all the land that drains to a particular stream, river, or lake.\n\n**Key concepts:**\n• What happens upstream affects downstream\n• Precipitation → runoff → groundwater → streams\n• Land use matters: forests filter water, pavement causes runoff\n• We all live in a watershed!\n\n**PA Watersheds:**\nPennsylvania has 6 major river basins:\n- Delaware\n- Susquehanna (largest)\n- Potomac\n- Ohio\n- Lake Erie\n- Genesee\n\n**Find your watershed:**\nUse the Watershed Explorer tool in this app or visit WildPraxis to map your local watershed and see conservation projects: https://wla-app.vercel.app/\n\nEverything you do on land affects your local stream!";
    }

    if (q.includes("wla") || q.includes("wildpraxis") || q.includes("wildlife leadership")) {
      return "⭐ **Wildlife Leadership Academy & WildPraxis**\n\nWLA is Pennsylvania's premier conservation training program for youth.\n\n**WildPraxis Platform** (https://wla-app.vercel.app/):\n• Track your conservation achievements\n• Earn badges and level up as an ambassador\n• Use interactive tools: watershed explorer, habitat builder, macro ID\n• Connect with other young conservationists\n• Find volunteer and career opportunities\n\n**WLA Programs:**\n• Youth Ambassador training\n• Field research projects\n• College-level mentorship\n• Conservation career pathways\n\n**How to get involved:**\n1. Complete your TIC program\n2. Apply for WLA Ambassador program (grades 6-12)\n3. Use WildPraxis to track field work\n4. Attend WLA field days and workshops\n\nTIC is your first step toward becoming a conservation leader!";
    }

    if (q.includes("career") || q.includes("job") || q.includes("biologist") || q.includes("fisheries")) {
      return "💼 **Conservation Careers in Pennsylvania**\n\n**PA Fish & Boat Commission:**\n• Fisheries Biologist\n• Aquatic Habitat Specialist\n• Waterways Conservation Officer\n• Environmental Education Specialist\n\n**DCNR:**\n• Park Naturalist\n• Forest Manager\n• Conservation Specialist\n\n**Non-profit Conservation:**\n• Trout Unlimited - Restoration Project Manager\n• Watershed Associations - Stream Coordinator\n• Western PA Conservancy - Land Steward\n\n**Education needed:**\n• Most positions require 4-year degree (Biology, Environmental Science, Wildlife Management)\n• Field experience is KEY - volunteer now!\n\n**Get started:**\n1. Join WLA Ambassador program\n2. Volunteer with TU, PFBC, county parks\n3. Participate in citizen science\n4. Shadow professionals (ask about ride-alongs!)\n\nCheck the Careers & Opportunities tab for current openings!";
    }

    if (q.includes("release") || q.includes("stocking") || q.includes("let go")) {
      return "🐟 **Release Day - Culmination of Your Work!**\n\n**When to release:**\n• Late April/Early May typically\n• Trout should be 3-4 inches long\n• Water temp in classroom tank and release stream should match (within 5°F)\n\n**Choosing a release site:**\n• Approved coldwater stream (PFBC can help identify)\n• Good trout habitat: cold, clean, well-oxygenated\n• Access for students\n• Permits required - coordinate with PFBC\n\n**Release day protocol:**\n1. Transport in insulated coolers with aerators\n2. Acclimate trout to stream temperature (30+ minutes)\n3. Release gently in suitable habitat (pools, undercut banks)\n4. Document with photos, count, location\n5. Celebrate your conservation work!\n\n**After release:**\n• Clean and store equipment\n• Reflect on learning\n• Plan next year!\n\nSee the Release Day lesson for full checklist.";
    }

    if (q.includes("pfbc") || q.includes("fish and boat") || q.includes("commission")) {
      return "🎣 **PA Fish & Boat Commission - Your TIC Partner**\n\n**PFBC provides:**\n• Trout eggs for your classroom\n• Technical support and training\n• Curriculum and resources\n• Release site permits\n\n**Contact PFBC:**\n• Education Division: 717-705-7835\n• Email: ra-pfbceducation@pa.gov\n• Website: www.fishandboat.com\n\n**Regional Offices:**\n• Northwest (Meadville): 814-337-0444\n• Southwest (Somerset): 814-445-8974\n• Southcentral (Bellefonte): 814-359-5130\n\n**Resources:**\n• Trout in the Classroom program guides\n• Virtual field trips with biologists\n• Career exploration opportunities\n• Volunteer events\n\nPFBC biologists LOVE working with students - don't hesitate to reach out!";
    }

    // Default response for unmatched questions
    return `🤔 Great question! I'm still learning about "${question}"\n\n**Here's what I can help with:**\n• Water quality (ammonia, nitrite, nitrate, temperature)\n• Trout biology and life cycle\n• Feeding and daily care\n• Macroinvertebrates and stream health\n• Watersheds and PA water resources\n• Conservation careers\n• WLA and WildPraxis connections\n• PFBC resources\n\n**Need more help?**\n• Check the lesson modules in this app\n• Visit WildPraxis: https://wla-app.vercel.app/\n• Contact PFBC Education: 717-705-7835\n• Ask your teacher or TIC coordinator\n\nTry asking me about any of these topics!`;
  }

  return (
    <Card className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-600" />
          <CardTitle className="text-lg">Brook - AI Conservation Assistant</CardTitle>
        </div>
        <CardDescription>
          Ask questions about trout care, water quality, watersheds, and conservation. Powered by AI, inspired by WLA's Brook.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-96 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === "user"
                    ? "bg-sky-600 text-white"
                    : "bg-white border border-slate-200"
                }`}
              >
                <div className="text-sm whitespace-pre-line">{msg.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about trout, water quality, careers..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!input.trim() || loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-slate-500">
          💡 Try asking: "What should I do about high ammonia?" or "Tell me about careers in fisheries"
        </div>
      </CardContent>
    </Card>
  );
}

