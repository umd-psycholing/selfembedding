// Pcibex setup
PennController.ResetPrefix(null);
DebugOff();
SetCounter("setcounter");

Sequence(
  "setcounter",
  "intro",
  "consent",
  "demo",
  "instruction",
  "practice_first",
  "practice_good",
  "practice_good_item",
  "practice_bad",
  "practice_bad_item",
  "practice_break",
  randomize("practice_rest"),
  "exp-start",
  sepWithN("break", rshuffle("exp", "filler"), 15),
  "send_results",
  "exit"
);


// Metadata
Header(
  newVar("itemnum").global(),
  newVar("trialN").global(),
  newVar("type").global(),
  newVar("condition").global(),
  newVar("text").global(),
  newVar("comma").global(),
  newVar("v2").global(),
  newVar("person").global(),
  newVar("c1").global(),
  newVar("c2").global(),
  newVar("grammatical").global(),
  newVar("RT").global(),
  newVar("Group").global()
)
  .log("PROLIFIC_ID", GetURLParameter("id"))
  .log("itemnum", getVar("itemnum"))
  .log("trialN", getVar("trialN"))
  .log("type", getVar("type"))
  .log("condition", getVar("condition"))
  .log("text", getVar("text"))
  .log("comma", getVar("comma"))
  .log("v2", getVar("v2"))
  .log("person", getVar("person"))
  .log("c1", getVar("c1"))
  .log("c2", getVar("c2"))
  .log("RT", getVar("RT"))
  .log("Group", getVar("Group"));

// List of constants
const cross_time = 2000;
const whitepage = 100;
const header_font_size = "36";
const body_font_size = "18";
const fname_practice = "640_practice.csv";
const fname_practice_first = "640_practice_first.csv";
const fname_practice_bad = "practice_bad_1.csv";
const fname_practice_good = "practice_good_1.csv";
const fname_exp = "640_experimental.csv";
const fname_filler = "640_filler.csv";

// CSS Constants

var page_css = {
  overflow: "auto",
  padding: "1em",
  "box-shadow": "4px 4px 2px #cacfd2",
  border: "1px solid #cacfd2",
  "border-radius": "2em",
};
var body_css = {
  margin: "0 auto",
  "font-size": body_font_size,
};

var cross_css = { "font-size": "100" };

var header_css = {
  "text-align": "center",
  margin: "0 auto",
  "font-size": header_font_size,
};

var button_css = {
  "background-color": "#E03A3E",
  color: "white",
  "font-size": "1.25em",
  padding: "0.5em",
  "border-radius": "0.25em",
  margin: "0 auto",
  "text-align": "center",
  border: "none", // Remove default button border
  display: "block", // To center the button
};
// Functions
//for inserting breaks
function SepWithN(sep, main, n) {
  this.args = [sep, main];

  this.run = function (arrays) {
    assert(
      arrays.length == 2,
      "Wrong number of arguments (or bad argument) to SepWithN"
    );
    assert(parseInt(n) > 0, "N must be a positive number");
    let sep = arrays[0];
    let main = arrays[1];

    if (main.length <= 1) return main;
    else {
      let newArray = [];
      while (main.length) {
        for (let i = 0; i < n && main.length > 0; i++)
          newArray.push(main.pop());
        for (let j = 0; j < sep.length && main.length > 0; ++j)
          newArray.push(sep[j]);
      }
      return newArray;
    }
  };
}
function sepWithN(sep, main, n) {
  return new SepWithN(sep, main, n);
}
// Cross
const newCross = () => [
  newText("cross", "+").center().bold().css(cross_css).print(),
  newTimer(cross_time).start().wait(),
  getText("cross").remove(),
];

// Trial number
const trialN = () => [
  newVar("TrialN", 0)
    .settings.global()
    .set((v) => v + 1),
];
// Demo
const newDemo = (label, text) => [
  newTextInput(label)
    .before(newText(text).size("15em", "1.5em"))
    .size("15em", "1.5em")
    .lines(1)
    .css({
      outline: "none",
      resize: "none",
      border: "0",
      padding: "0",
      margin: "0",
      "margin-left": "1ex",
      "margin-right": "1ex",
      "vertical-align": "-.33em",
      "background-color": "white",
      "border-bottom": "2px solid black",
      display: "inline",
    })
    .center()
    .log(),
];
// Question
const newQ = () => [
  newTimer("hurry", 5000).start(),
  newText("question", "How natural was the sentence?")
    .cssContainer({ "margin-bottom": "2em" })
    .center()
    .print(),
  newScale("grade", "1", "2", "3", "4", "5", "6", "7")
    .labelsPosition("bottom")
    .before(
      newText("left", "Unnatural")
        .css("margin-right", "1em")
        .css("margin-top", "2.5em")
    )
    .after(
      newText("right", "Natural")
        .css("margin-right", "1em")
        .css("margin-top", "2.5em")
    )
    .css("margin", "10pt")
    .cssContainer("border", "solid 1px black")
    .center()
    .keys()
    .print()
    .callback(getTimer("hurry").stop())
    .log(),
  getTimer("hurry").wait(),
  newTimer("feedback",500).start().wait(),
  // Make everything disappear
  getText("question").remove(),
  getScale("grade").remove(),
];
// Dash
const newDash = (text) => [
  newController("DashedSentence", {s: text})
    .center()
    .print()
    .css({"font-size": 24})
    .wait()
    .log()
    .remove(),
];


// INTRO
newTrial(
  "intro",
  newText(
    "welcome-body",
    "<center><b>Welcome!</b></center>" +
      "<p>Please read these instruction sections carefully! " +
      "If you fail to understand the task, your data will NOT be usable." +
      "<p>In this experiment, you will read some sentences and be asked to judge them for naturalness." +
      "<p>This experiment requires your FULL ATTENTION. " +
      "The experiment is reasonably brief. Most people find that the study takes around 30 minutes. " +
      "<p>Before proceeding please make sure:<ol>" +
      "<li>You are using your <b>computer</b>, and not your phone or tablet,</li>" +
      "<li>You are using <b>Google Chrome</b>, and not Safari or Firefox,</li>" +
      "<li>You have a <b>working mouse/trackpad and keyboard</b>,</li>" +
      "<li>You are a native speaker of <b>American English</b>,</li>" +
      "<li>You are <b>older than 18</b> years old,</li>" +
      "<li>This is your <b>first time doing this experiment</b>.</li></ol>"
  ).css(body_css),
  newCanvas("welcome-page", 1500, 500)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 120, getText("welcome-body"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("CONTINUE").bold().css(button_css).print().wait()
).setOption("hideProgressBar", true);

// CONSENT
newTrial(
  "consent",
  newText(
    "consent-body",
    "<center><b>Consent Form</b></center>" +
      "<p>Please click <a target='_blank' rel='noopener noreferrer' href='https://utkuturk.com/files/web_consent.pdf'> here</a> to download the consent form for this study. If you read it and agree to participate in this study, click 'I Agree' below. If you do not agree to participate in this study, you can leave this study by closing the tab. You can leave the experiment at any time by closing the tab during the experiment. If you leave the experiment before completion of both parts, you will not be compensated for your time. If you encounter any problems, do not hesitate to reach either of us  via " +
      "Prolific or e-mail." +
      // "email. " +
      "<br><br><b> Researchers:</b> <br>Utku Turk, PhD Student <i> (utkuturk@umd.edu)</i>,<br>Prof. Ellen Lau<br>University of Maryland, Department of Linguistics"
  ).css(body_css),
  newCanvas("consent-page", 1500, 500)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 120, getText("consent-body"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("agree", "I AGREE").bold().css(button_css).print().wait()
).setOption("hideProgressBar", true);

// DEMO
newTrial(
  "demo",
  newDemo("pid", "Prolific ID*:"),
  newDemo("age", "Age*:"),
  newDemo("gender", "Gender*:"),
  newDemo("geo", "Location (state, country):"),
  newDemo("comp", "Computer type (e.g. Mac, PC)*:"),
  newDemo("language", "Native language*:"),
  newDemo("otherlg", "Other languages you speak (please list):"),
  newCanvas("demo-page", 1500, 400)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(
      0,
      120,
      newText(
        "Make sure that you entered all the information below. Obligatory ones are marked with *."
      )
    )
    .add(0, 160, getTextInput("pid"))
    .add(0, 190, getTextInput("age"))
    .add(0, 220, getTextInput("gender"))
    .add(0, 250, getTextInput("geo"))
    .add(0, 280, getTextInput("comp"))
    .add(0, 310, getTextInput("language"))
    .add(0, 340, getTextInput("otherlg"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("CONTINUE")
    .bold()
    .css(button_css)
    .print()
    .wait(
      getTextInput("age")
        .test.text(/^\d+.+$/)
        .failure(
          newText("Age should be a numeric value").settings.color("red").print()
        )
        .and(
          getTextInput("pid")
            .testNot.text("")
            .failure(
              newText("Please enter your Prolific ID!")
                .settings.color("red")
                .print()
            )
        )
        .and(
          getTextInput("language")
            .testNot.text("")
            .failure(
              newText("Please enter your mother language")
                .settings.color("red")
                .print()
            )
        )
        .and(
          getTextInput("gender")
            .testNot.text("")
            .failure(
              newText(
                "Please indicate your gender or write 'prefer not to say'"
              )
                .settings.color("red")
                .print()
            )
        )
        .and(
          getTextInput("geo")
            .testNot.text("")
            .failure(
              newText("Please enter your current location")
                .settings.color("red")
                .print()
            )
        )
        .and(
          getTextInput("comp")
            .testNot.text("")
            .failure(
              newText("Please indicate your computer type")
                .settings.color("red")
                .print()
            )
        )
    )
);

// Instructions
newTrial(
  "instruction",
  newText(
    "instruction-text",
    "<center><b>Instructions</b></center><br>" +
      "In this experiment, you will use your keyboard to reveal sentences one word at a time by pressing space key. After you have read the sentence, you will be asked to judge it by using your mouse or keyboard to select a value on a scale from 1 to 7. 1 means you found the sentence completely unnatural and not understandable. 7 means the sentence is perfectly natural and understandable. Click 'See an Example' below to see how it works before you begin the experiment.<p><b>Please press the spacebar only after reading each word. Rapidly pressing the spacebar will result in your exclusion from the study and you will not be compensated.</b><br><br>"
  )
    .center()
    .css(body_css),
  newCanvas("inst-page", 1500, 450)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 120, getText("instruction-text"))
    .cssContainer(page_css)
    .print(),
  newButton("to-inst-item", "See an example")
    .center()
    .css(button_css)
    .print()
    .wait(),
  getCanvas("inst-page").remove(),
  getButton("to-inst-item").remove(),
  newDash("The door was shut to reduce the noise coming from next door."),
  newQ(),
  newText(
    "inst-text-2",
    "<br>Now, you will go through some practice items to get you used to the task. For every item, you will have 5 seconds to judge the sentence. If you do not judge the sentence in 5 seconds, the experiment will continue to the next item. If you do not have enough sentences answered, your data will not be usable and you will be excluded."
  ).css(body_css),
  newCanvas("inst-page-2", 1500, 250)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 120, getText("inst-text-2"))
    .cssContainer(page_css)
    .print(),
  newButton("to-practice", "Click here to begin practice items")
    .center()
    .css(button_css)
    .print()
    .wait()
);

// Exp-Start
newTrial(
  "practice_good",
  newText(
    "practice_good-body",
    "That's all there is to it! Let's try some practice sentences more like the ones you'll be seeing in the experiment. We would expect you to find the following sentences NATURAL (higher numbers on the scale)."
  ).css(body_css),
  newCanvas("start-page", 1500, 300)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 170, getText("practice_good-body"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("CONTINUE").bold().css(button_css).print().wait(),
  newTimer(300).start().wait()
);


newTrial(
  "practice_bad",
  newText(
    "practice_bad-body",
    "Some sentences, like the one you just read, are acceptable sentences in English." +
      "<p>Try your hand at these next few sentences, which should be judged as UNNATURAL (lower numbers on the scale)."
  ).css(body_css),
  newCanvas("start-page", 1500, 300)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 170, getText("practice_bad-body"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("CONTINUE").bold().css(button_css).print().wait(),
  newTimer(300).start().wait()
  // The text above
);



newTrial(
  "practice_break",
  newText(
    "practice_break-body",
    "Got it? Try a few more sentences to make sure that you get the idea!"
  ).css(body_css),
  newCanvas("start-page", 1500, 300)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 170, getText("practice_break-body"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("CONTINUE").bold().css(button_css).print().wait(),
  newTimer(300).start().wait()
  // The text above
);


// Exp-Start
newTrial(
  "exp-start",
  newText(
    "exp-start-body",
    "<center><b>Time to start the experiment!</b></center><br><br>" +
    "<p>Before continuing, please double-check " +
      "that you are in a quiet environment with minimal or no background noise." +
      "<p>You can press 'Continue'  to start the experiment."
  ).css(body_css),
  newCanvas("start-page", 1500, 300)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 120, getText("exp-start-body"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("CONTINUE").bold().css(button_css).print().wait(),
  newTimer(300).start().wait()
  // The text above
);

// BREAK
newTrial(
  "break",
  newText(
    "Let's take a short break! Press space key to continue when you are ready."
  )
    .css(header_css)
    .print(),
  newKey(" ").wait()
);

// SEND RESULTS
SendResults("send_results");

// EXIT
newTrial(
  "exit",
  newText("exit-text",
    "<center><b>Thank you for participating in our study!</b></center><br><br>" +
    "The experiment code is CUM27WVU  " +
      "Please paste this value into Prolific." +
      "<p>You can also confirm your participation on Prolific by clicking the link below: " +
      "<a href='https://app.prolific.com/submissions/complete?cc=CUM27WVU'>Confirm your participation.</a>" +
      "<p>When you are finished, you may close this tab."
  ).css(body_css),
  newCanvas("exit-page", 1500, 250)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 120, getText("exit-text"))
    .cssContainer(page_css)
    .print(),
  newTimer("infinite", 1000).wait()
);

// Practice Items

var trial = (label) => (row) => {
  return newTrial(
    label,
    trialN(),
    newCross(),
    newDash(row.sentence),
    newVar("RT-answer", 0)
      .settings.global()
      .set((v) => Date.now()),
    newQ(),
    getVar("RT-answer").set((v) => Date.now() - v),
    getVar("itemnum").set(row.id),
    getVar("type").set(row.type),
    getVar("condition").set(row.condition),
    getVar("text").set(row.sentence),
    getVar("comma").set(row.comma),
    getVar("v2").set(row.v2),
    getVar("person").set(row.person),
    getVar("c1").set(row.c1_type),
    getVar("c2").set(row.c2_type),
    getVar("Group").set(row.Group),
    getVar("RT").set(getVar("RT-answer")),
    getVar("trialN").set(getVar("TrialN"))
  );
};



Template(GetTable(fname_practice_first), trial("practice_first"));
Template(GetTable(fname_practice_good), trial("practice_good_item"));
Template(GetTable(fname_practice_bad), trial("practice_bad_item"));
Template(GetTable(fname_practice), trial("practice_rest"));

Template(GetTable(fname_filler), trial("filler"));
Template(GetTable(fname_exp), trial("exp"));
