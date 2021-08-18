import { Message } from "discord.js";
import { Command, LNDetail } from "../../../types";
import * as bookmeter from "../../../utils/bookmeter";
import { getLNEmbed, notFoundEmbed } from "../../../utils";

class LNRecc implements Command {
    stringParams: string[];

    limit = 1;

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromLN = this.stringParams[0];
        const limitRecs = this.stringParams[1];

        if (fromLN) {
            if (limitRecs) {
                if (
                    !Number.isNaN(Number(limitRecs)) &&
                    Number(limitRecs) <= 5 &&
                    Number(limitRecs) > 0
                ) {
                    this.limit = Number(limitRecs);
                }
            } else {
                this.limit = 1;
            }

            return true;
        }
        return false;
    }

    async run(msg: Message): Promise<void> {
        try {
            const reccIds = await bookmeter.showDetailsForLN(
                null,
                this.stringParams[0].slice(1, -1),
                true
            );
            (reccIds as string[])
                .slice(0, this.limit)
                .forEach(async (recc: string) => {
                    const lnInfo = await bookmeter.showDetailsForLN(recc, "");
                    const embed = getLNEmbed(lnInfo as LNDetail);
                    msg.channel.send({ embed });
                });
        } catch (error) {
            notFoundEmbed(msg, "Light Novel");
        }
    }
}

export default LNRecc;
