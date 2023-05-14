import { IsoPlayer, _instanceof_, getPlayer, getSandboxOptions, getSoundManager, getWorldSoundManager, isDebugEnabled, sendClientCommand } from "@asledgehammer/pipewrench";
import { onPlayerDeath, onServerCommand } from "@asledgehammer/pipewrench-events";

// Play thunder strike effect
function playThunderStrike(isKiller: boolean = false, isVictim: boolean = false) {
    const player = getPlayer();
    if (player !== undefined) {
        getSoundManager().PlayWorldSoundImpl("DeathThunderStrike", false, player.getX(), player.getY(), player.getZ(), 1, 1, 1, false);
        if (isKiller) {
            getSoundManager().PlayWorldSoundImpl("DeathThunderKiller", false, player.getX(), player.getY(), player.getZ(), 1, 1, 1, false);
        }
        if (isVictim) {
            getSoundManager().PlayWorldSoundImpl("DeathThunderVictim", false, player.getX(), player.getY(), player.getZ(), 1, 1, 1, false);

            const Zombie_Attraction_Radius: number = (getSandboxOptions().getOptionByName("DeathThunder.Zombie_Attraction_Radius") as any)?.getValue();
            if (Zombie_Attraction_Radius > 0) {
                getWorldSoundManager().addSound(null, player.getX(), player.getY(), player.getZ(), Zombie_Attraction_Radius, Zombie_Attraction_Radius, false);
            }
        }
    }
}

// Listen for player death events
onPlayerDeath.addListener((player: IsoPlayer) => {    
    if (player.isLocalPlayer()) {
        const killer = player.getAttackedBy() as IsoPlayer;
        sendClientCommand("death-thunder", "player-died", {
            killer: (killer !== undefined) ? killer.getOnlineID() : undefined,
        });
    }
});

// Listen for server commands
onServerCommand.addListener((module: string, command: string, args: { isKiller: boolean, isVictim: boolean }) => {
    if (module != "death-thunder") return;

    if (command === "gods-wrath") {
        playThunderStrike(args.isKiller, args.isVictim);
    }
});

// Expose functions to the global scope for debugging
if (isDebugEnabled()) {
    _G.playThunderStrike = playThunderStrike;
}
