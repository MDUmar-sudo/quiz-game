import express from "express";
import serverless from "serverless-http";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
var options = [];
var correct_option = "";
var score = 0;
let data = {};

app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// to read the quiz.json file

// const quizFile = fs.readFileSync("./quiz.json", "utf-8");
const quizFile = fs.readFileSync(path.join(process.cwd(), "quiz.json"), "utf-8");
const quiz = JSON.parse(quizFile);

// to get randomquiz from the quiz[]
function getRandomQuiz() {
    return quiz.results[Math.floor(Math.random() * quiz.results.length)];
}

// to shuffle the options array
function shuffle() {
    let currentIndex = options.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [options[currentIndex], options[randomIndex]] = [options[randomIndex], options[currentIndex]];
    }
    return options;
}

// to check if the selected option is correct or not
function isCorrect(option) {
    if (option===correct_option) {
        return true;
    } else {
        return false;
    }
}

app.get("/",  (req, res) => {

    const result = getRandomQuiz();
    const answers  = [...new Set(result.incorrect_answers)];
    correct_option = result.correct_answer;
    answers.push(correct_option);
    answers.forEach((option) => { options.push(option.replace(/&prime;/g, "'").replace(/&Prime;/g, '"').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&eacute;/g, "é").replace(/&rsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&hellip;/g, "...").replace(/&Uuml;/g, "Ü").replace(/&ouml;/g, "ö").replace(/&auml;/g, "ä").replace(/&uuml;/g, "ü").replace(/&Ouml;/g, "Ö").replace(/&Auml;/g, "Ä").replace(/&szß;/g, "ß")) });
    console.log(options);
    try {
        data = {
            type: result.type,
            question: (result.question).replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&eacute;/g, "é").replace(/&rsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&hellip;/g, "...").replace(/&Uuml;/g, "Ü").replace(/&ouml;/g, "ö").replace(/&auml;/g, "ä").replace(/&uuml;/g, "ü").replace(/&Ouml;/g, "Ö").replace(/&Auml;/g, "Ä").replace(/&szlig;/g, "ß"),
            options: shuffle(options),
            category: result.category.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"),
            correct_option: (correct_option).replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&eacute;/g, "é").replace(/&rsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&hellip;/g, "...").replace(/&Uuml;/g, "Ü").replace(/&ouml;/g, "ö").replace(/&auml;/g, "ä").replace(/&uuml;/g, "ü").replace(/&Ouml;/g, "Ö").replace(/&Auml;/g, "Ä").replace(/&szlig;/g, "ß"),
            score: score
        }
        options = [];
        console.log(data,correct_option);
        res.render("index.ejs", { data: data });
    } catch (err) {
        res.render("index.ejs", { error: "Searching for more questions...." });
    }
    
});
app.post("/result", (req, res) => {
    console.log(req.body.option,correct_option);
    const iscorrect = isCorrect(req.body.option)
    try {
        if (iscorrect) {
            score++;
        } else {
            score = 0;
        }
        data.score = score;
        res.redirect("/");
        
    } catch (error) {
        res.status(404).json({error: "Searching for more questions...." });
    }
   
});

// app.listen(port, (req, res) => {
//     console.log(`http://localhost:${port}`);
// });

export const handler = serverless(app);
