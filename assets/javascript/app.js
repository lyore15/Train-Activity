$(document).ready(function () {

    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyAlBesnULPTxSJu81oQP7Ers0vr7K9j7nk",
        authDomain: "trainschedule-33515.firebaseapp.com",
        databaseURL: "https://trainschedule-33515.firebaseio.com",
        projectId: "trainschedule-33515",
        storageBucket: "",
        messagingSenderId: "622263537324"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submit").on("click", function (event) {

        event.preventDefault();

        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var trainTime = $("#trainTime").val().trim();
        var frequency = $("#frequency").val().trim();

        var newTrain = {
            name: trainName,
            destination: destination,
            time: trainTime,
            frequency: frequency
        };

        database.ref().push(newTrain);

        //clear input fields after submit
        $("#trainName").val("");
        $("#destination").val("");
        $("#trainTime").val("");
        $("#frequency").val("");
    });



    // database.ref().push({
    //     name: trainName,
    //     destination: destination,
    //     time: trainTime,
    //     frequency: frequency
    // })

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        //store everything into a variable
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var trainTime = childSnapshot.val().time;
        var frequency = childSnapshot.val().frequency;

        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().time);
        console.log(childSnapshot.val().frequency);

        //convert first train time back a year to make sure it is set before current time before pushing to firebase.

        var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
        console.log(trainTimeConverted);

        //set a variable equal to the current time from moment.js

        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));

        //post current time to jumbotron for reference

        $("#currentTime").html("Current Time: " + moment(currentTime).format("hh:mm"));

        //find the difference between the first train time and the current time

        var timeDiff = moment().diff(moment(trainTimeConverted), "minutes");
        console.log("Difference In Time: " + timeDiff);

        //find the time apart by finding the remainder of the time difference and the frequency - use modal to get whole remainder number

        var timeRemainder = timeDiff % frequency;
        console.log(timeRemainder);

        //find the minutes until the next train

        var nextTrainMin = frequency - timeRemainder;
        console.log("Minutes Till Train: " + nextTrainMin);

        //find the time of the next train arrival

        var nextTrainAdd = moment().add(nextTrainMin, "minutes");
        var nextTrainArr = moment(nextTrainAdd).format("hh:mm a");
        console.log("Arrival Time: " + nextTrainArr);

        //prepend all information for train data submitted by user

        $("#trainTable").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrainArr + "</td><td>" + nextTrainMin + "</td><tr>");

    });
});