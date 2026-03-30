import { Innertube, UniversalCache } from 'youtubei.js';
import getEnvVar from '../../utils/env.js';

export let yt: Innertube;
export async function initInnerTube(){
    yt = await Innertube.create({
        cookie: getEnvVar("YT_COOKIE"),
        cache: new UniversalCache(false)
    });
}