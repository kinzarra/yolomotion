// «Как разработчики обманывали нас десятилетиями»: the hook block, part 1 and
// part 2. The series kit on a 1920×1080 stage: captions in the bottom band,
// type in the left two thirds, evidence (receipts, screenshots, face, clips,
// logos, terminal) around it; the sound layer (music bed + SFX) on top.
import React from "react";
import { Reel, Scene } from "../../reel";
import { devMythColors as colors, devMythPalette as palette } from "./palette";
import { DevMythProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { WIDE } from "./ui";
import { SoundLayer } from "./sound";
import { BillScene } from "./scenes/BillScene";
import { TodayScene } from "./scenes/TodayScene";
import { HookScene } from "./scenes/HookScene";
import { MinutesScene } from "./scenes/MinutesScene";
import { BelieveScene, ButtonScene, LanguagesScene, ProfessionScene, SalaryScene, TermsScene } from "./scenes/Part1A";
import { AiScene, ExplainScene, MachineScene, MiracleScene, NotQuiteScene, PriestsScene, WhyScene } from "./scenes/Part1B";
import { P3AutoScene, P3CodeScene, P3EstimateScene, P3FifthScene, P3FindScene, P3IdeaScene, P3MonthsScene, P3NinetyScene, P3NowScene, P3OpenScene, P3PayScene, P3PayWhatScene, P3PromptScene, P3StatsScene, P3SurveyScene, P3TaskScene, P3ThenScene, P3ThinkScene, P3WorksScene } from "./scenes/Part3";
import { AlgoScene, ArchitectScene, BothScene, CheaperScene, ConclusionScene, DontMixScene, ErrorsScene, ExampleScene, FinaleScene, HarderScene, IronyScene, MarketScene, ModelScene, ObjectionsScene, PeopleScene, Q4Scene, RevolutionScene, SkillScene, SortScene, SpecScene, TenScene, TwoScene, TypicalScene, UnpleasantScene, SubscribeScene } from "./scenes/Part45";
import { HardScene, LibsScene, P2IntroScene, PartCard, QuestionScene, ScratchScene, SearchScene, SolvedScene, TasksScene, ThingScene, Why2Scene, WhoScene } from "./scenes/Part2";

export const DevMyth: React.FC<DevMythProps> = ({ salary, price, source }) => (
  <Reel
    palette={palette}
    voiceoverDir="dev-myth"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={{ top: 950, fontSize: 42, maxWidth: 1500, sideMargin: 200, mode: "box", uppercase: true, boxTilt: 2, fontFamily: WIDE, fontWeight: 900, activeColor: palette.primary, activeInk: colors.ink2, heroColor: palette.primary, badColor: colors.bad, textShadow: `0 4px 22px ${palette.bg}`, stroke: `8px ${palette.bg}`, letterSpacing: "-0.01em" }}
  >
    <SoundLayer />
    <Scene spec={SCENES.bill} name="01 bill"><BillScene salary={salary} source={source} price={price} /></Scene>
    <Scene spec={SCENES.today} name="02 today"><TodayScene salary={salary} price={price} /></Scene>
    <Scene spec={SCENES.hook} name="03 hook"><HookScene /></Scene>
    <Scene spec={SCENES.minutes} name="04 minutes"><MinutesScene /></Scene>
    <Scene spec={SCENES.profession} name="05 profession"><ProfessionScene /></Scene>
    <Scene spec={SCENES.languages} name="06 languages"><LanguagesScene /></Scene>
    <Scene spec={SCENES.terms} name="07 terms"><TermsScene /></Scene>
    <Scene spec={SCENES.salary} name="08 salary"><SalaryScene salary={salary} /></Scene>
    <Scene spec={SCENES.button} name="09 button"><ButtonScene /></Scene>
    <Scene spec={SCENES.believe} name="10 believe"><BelieveScene /></Scene>
    <Scene spec={SCENES.why} name="11 why"><WhyScene /></Scene>
    <Scene spec={SCENES.priests} name="12 priests"><PriestsScene /></Scene>
    <Scene spec={SCENES.ai} name="13 ai"><AiScene /></Scene>
    <Scene spec={SCENES.miracle} name="14 miracle"><MiracleScene /></Scene>
    <Scene spec={SCENES.machine} name="15 machine"><MachineScene /></Scene>
    <Scene spec={SCENES.notquite} name="16 notquite"><NotQuiteScene /></Scene>
    <Scene spec={SCENES.explain} name="17 explain"><ExplainScene /></Scene>
    <Scene spec={SCENES.p2card} name="18 part 2"><PartCard n="02" title="ЧТО НА САМОМ ДЕЛЕ ДЕЛАЕТ ПРОГРАММИСТ" /></Scene>
    <Scene spec={SCENES.p2intro} name="19 p2 intro"><P2IntroScene /></Scene>
    <Scene spec={SCENES.tasks} name="20 tasks"><TasksScene /></Scene>
    <Scene spec={SCENES.hard} name="21 hard"><HardScene /></Scene>
    <Scene spec={SCENES.thing} name="22 thing"><ThingScene /></Scene>
    <Scene spec={SCENES.solved} name="23 solved"><SolvedScene /></Scene>
    <Scene spec={SCENES.scratch} name="24 scratch"><ScratchScene /></Scene>
    <Scene spec={SCENES.libs} name="25 libs"><LibsScene /></Scene>
    <Scene spec={SCENES.question} name="26 question"><QuestionScene /></Scene>
    <Scene spec={SCENES.why2} name="27 why"><Why2Scene /></Scene>
    <Scene spec={SCENES.search} name="28 search"><SearchScene /></Scene>
    <Scene spec={SCENES.who} name="29 who"><WhoScene /></Scene>
    <Scene spec={SCENES.p3card} name="30 part 3"><PartCard n="03" title="ИИ РАЗРУШИЛ МОНОПОЛИЮ НА КОД" /></Scene>
    <Scene spec={SCENES["27-p3then"]} name="31 then"><P3ThenScene /></Scene>
    <Scene spec={SCENES["28-idea"]} name="32 idea"><P3IdeaScene /></Scene>
    <Scene spec={SCENES["29-find"]} name="33 find"><P3FindScene /></Scene>
    <Scene spec={SCENES["30-pay"]} name="34 pay"><P3PayScene salary={salary} /></Scene>
    <Scene spec={SCENES["31-task"]} name="35 task"><P3TaskScene /></Scene>
    <Scene spec={SCENES["32-estimate"]} name="36 estimate"><P3EstimateScene /></Scene>
    <Scene spec={SCENES["33-code"]} name="37 code"><P3CodeScene /></Scene>
    <Scene spec={SCENES["34-months"]} name="38 months"><P3MonthsScene salary={salary} /></Scene>
    <Scene spec={SCENES["35-now"]} name="39 now"><P3NowScene /></Scene>
    <Scene spec={SCENES["36-open"]} name="40 open"><P3OpenScene /></Scene>
    <Scene spec={SCENES["37-prompt"]} name="41 prompt"><P3PromptScene /></Scene>
    <Scene spec={SCENES["38-works"]} name="42 works"><P3WorksScene /></Scene>
    <Scene spec={SCENES["39-auto"]} name="43 auto"><P3AutoScene /></Scene>
    <Scene spec={SCENES["40-stats"]} name="44 stats"><P3StatsScene /></Scene>
    <Scene spec={SCENES["41-survey"]} name="45 survey"><P3SurveyScene /></Scene>
    <Scene spec={SCENES["42-ninety"]} name="46 ninety"><P3NinetyScene /></Scene>
    <Scene spec={SCENES["43-fifth"]} name="47 fifth"><P3FifthScene /></Scene>
    <Scene spec={SCENES["44-think"]} name="48 think"><P3ThinkScene /></Scene>
    <Scene spec={SCENES["45-paywhat"]} name="49 pay what"><P3PayWhatScene salary={salary} /></Scene>
    <Scene spec={SCENES.p4card} name="50 part 4"><PartCard n="04" title="А КАК ЖЕ ТВОРЧЕСТВО?" /></Scene>
    <Scene spec={SCENES["46-objections"]} name="51 objections"><ObjectionsScene /></Scene>
    <Scene spec={SCENES["47-sort"]} name="52 sort"><SortScene /></Scene>
    <Scene spec={SCENES["48-two"]} name="53 two"><TwoScene /></Scene>
    <Scene spec={SCENES["49-both"]} name="54 both"><BothScene /></Scene>
    <Scene spec={SCENES["50-algo"]} name="55 algo"><AlgoScene /></Scene>
    <Scene spec={SCENES["51-typical"]} name="56 typical"><TypicalScene /></Scene>
    <Scene spec={SCENES["52-dontmix"]} name="57 dont mix"><DontMixScene /></Scene>
    <Scene spec={SCENES["53-errors"]} name="58 errors"><ErrorsScene /></Scene>
    <Scene spec={SCENES["54-people"]} name="59 people"><PeopleScene /></Scene>
    <Scene spec={SCENES["55-question"]} name="60 question"><Q4Scene /></Scene>
    <Scene spec={SCENES["56-model"]} name="61 model"><ModelScene /></Scene>
    <Scene spec={SCENES.p5card} name="62 part 5"><PartCard n="05" title="ПРОГРАММИСТЫ ИСЧЕЗНУТ?" /></Scene>
    <Scene spec={SCENES["57-unpleasant"]} name="63 unpleasant"><UnpleasantScene /></Scene>
    <Scene spec={SCENES["58-spec"]} name="64 spec"><SpecScene /></Scene>
    <Scene spec={SCENES["59-architect"]} name="65 architect"><ArchitectScene /></Scene>
    <Scene spec={SCENES["60-market"]} name="66 market"><MarketScene /></Scene>
    <Scene spec={SCENES["61-ten"]} name="67 ten"><TenScene /></Scene>
    <Scene spec={SCENES["62-example"]} name="68 example"><ExampleScene /></Scene>
    <Scene spec={SCENES["63-cheaper"]} name="69 cheaper"><CheaperScene /></Scene>
    <Scene spec={SCENES["64-skill"]} name="70 skill"><SkillScene /></Scene>
    <Scene spec={SCENES["65-harder"]} name="71 harder"><HarderScene /></Scene>
    <Scene spec={SCENES["66-irony"]} name="72 irony"><IronyScene /></Scene>
    <Scene spec={SCENES["67-conclusion"]} name="73 conclusion"><ConclusionScene salary={salary} /></Scene>
    <Scene spec={SCENES["68-revolution"]} name="74 revolution"><RevolutionScene /></Scene>
    <Scene spec={SCENES["69-cta"]} name="75 finale"><FinaleScene /></Scene>
    <Scene spec={SCENES["70-sub"]} name="76 subscribe"><SubscribeScene /></Scene>
  </Reel>
);
