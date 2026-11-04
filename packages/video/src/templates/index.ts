// Template registry — the product catalog. Every template listed here is
// automatically registered in Root.tsx (one composition per supported format)
// and becomes renderable by id through the renderer package.
import { VideoTemplate } from "./types";
import { digitalRuble } from "./digital-ruble";
import { usdFivePeople } from "./usd-five-people";
import { salary2013 } from "./salary-2013";
import { teslaRoadster } from "./tesla-roadster";
import { teslaRoadsterEn } from "./tesla-roadster-en";
import { minWage725 } from "./min-wage-725";
import { sberbook1991 } from "./sberbook-1991";
import { sberbook1991Cover } from "./sberbook-1991/Cover";
import { unelectedFive } from "./unelected-five";
import { aiJobsTop5 } from "./ai-jobs-top5";
import { aiJobsTop5En } from "./ai-jobs-top5-en";
import { warMoneyRisks } from "./war-money-risks";
import { aiOnePercent } from "./ai-one-percent";
import { aiOnePercentEn } from "./ai-one-percent-en";
import { aiSkillsTop5 } from "./ai-skills-top5";
import { salaryPyramid } from "./salary-pyramid";
import { sponsorshipPromo } from "./sponsorship-promo";
import { fastPayback2026 } from "./fast-payback-2026";
import { aiMoneyCircle } from "./ai-money-circle";
import { zhkhReceipt } from "./zhkh-receipt";
import { dessaDuplex } from "./dessa-duplex";
import { vibecodingLayers } from "./vibecoding-layers";
import { fourWallets } from "./four-wallets";
import { lifeLines } from "./life-lines";
import { lifeLinesGuide } from "./life-lines/Guide";
import { lifeLinesCover } from "./life-lines/Cover";
import { lifeSpend } from "./life-spend";
import { brainAges } from "./brain-ages";
import { serbiaEconomy } from "./serbia-economy";
import { ballonDorMoney } from "./ballon-dor-money";
import { ballonDorMoneyCover } from "./ballon-dor-money/Cover";
import { shawarmaFactory } from "./shawarma-factory";
import { fedexBlackjack } from "./fedex-blackjack";
import { nintendoCards } from "./nintendo-cards";
import { binanceHack } from "./binance-hack";
import { devMyth } from "./dev-myth";
import { devMythThumb } from "./dev-myth/Thumb";
import { devMythShorts } from "./dev-myth/ShortCut";
import { devMythArticle } from "./dev-myth/ArticleArt";
import { phoneSlowdown } from "./phone-slowdown";

export const templates: VideoTemplate<any>[] = [digitalRuble, usdFivePeople, salary2013, teslaRoadster, teslaRoadsterEn, minWage725, sberbook1991, sberbook1991Cover, unelectedFive, aiJobsTop5, aiJobsTop5En, warMoneyRisks, aiOnePercent, aiOnePercentEn, aiSkillsTop5, salaryPyramid, sponsorshipPromo, aiMoneyCircle, fastPayback2026, zhkhReceipt, vibecodingLayers, fourWallets, lifeLines, lifeLinesGuide, lifeLinesCover, lifeSpend, serbiaEconomy, brainAges, ballonDorMoney, ballonDorMoneyCover, dessaDuplex, shawarmaFactory, nintendoCards, fedexBlackjack, binanceHack, devMyth, devMythThumb, ...devMythShorts, ...devMythArticle, phoneSlowdown];
