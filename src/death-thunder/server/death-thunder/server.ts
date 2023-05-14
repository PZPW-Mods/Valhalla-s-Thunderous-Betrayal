import { Faction, IsoPlayer, getClimateManager, getOnlinePlayers, getPlayerByOnlineID, getSandboxOptions, sendServerCommand } from "@asledgehammer/pipewrench";
import { onClientCommand } from "@asledgehammer/pipewrench-events";

// Listen for client commands
onClientCommand.addListener((module: string, command: string, player: IsoPlayer, args: any) => {
    if (module != "death-thunder") return;

    if (command === "player-died") {
        const opts = args as { killer: number };
        const killer = (opts && opts.killer != undefined) ? getPlayerByOnlineID(opts.killer) : undefined;
        const playerFaction = Faction.getPlayerFaction(player);
        const killerFaction = (killer !== undefined) ? Faction.getPlayerFaction(killer) : undefined;
        const isNotSameFaction = ((playerFaction === undefined || killerFaction === undefined) || playerFaction?.getName() !== killerFaction?.getName());
        
        const PvP_Exclusive_Mode: boolean = (getSandboxOptions().getOptionByName("DeathThunder.PvP_Exclusive_Mode") as any)?.getValue();
        const Faction_Friendly_Fire: boolean = (getSandboxOptions().getOptionByName("DeathThunder.Faction_Friendly_Fire") as any)?.getValue();

        if (!PvP_Exclusive_Mode || (killer != undefined && (Faction_Friendly_Fire || isNotSameFaction))) {
            const players = getOnlinePlayers();
            for (let i = 0; i < players.size(); i++) {
                const p = players.get(i);
                getClimateManager().transmitServerTriggerLightning(p.getX(), p.getY(), true, true, true);
                sendServerCommand(p, "death-thunder", "gods-wrath", { isKiller: p === killer, isVictim: p === player });
                _G.SandboxVars
            }
        }
    }
});
