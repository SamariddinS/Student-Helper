document.addEventListener('DOMContentLoaded', function () {
    var modeSwitch = document.querySelector('.mode-switch');
    modeSwitch.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
        modeSwitch.classList.toggle('active');
    });

    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');

    listView.addEventListener('click', function () {
        gridView.classList.remove('active');
        listView.classList.add('active');
        projectsList.classList.remove('jsGridView');
        projectsList.classList.add('jsListView');
    });

    gridView.addEventListener('click', function () {
        gridView.classList.add('active');
        listView.classList.remove('active');
        projectsList.classList.remove('jsListView');
        projectsList.classList.add('jsGridView');
    });

    document.querySelector('.messages-btn').addEventListener('click', function () {
        document.querySelector('.messages-section').classList.add('show');
    });

    document.querySelector('.messages-close').addEventListener('click', function () {
        document.querySelector('.messages-section').classList.remove('show');
    });
});


async function getinfo() {
    let date = new Date()
    let day = [0, 1, 2, 3, 4, 5][date.getDay()]
    let info = await fetch('https://journal.bsuir.by/api/v1/studentGroup/schedule?studentGroup=921732')
    let readJson = await info.json()

    let lessonTime = [readJson.todaySchedules[0].lessonTime, readJson.todaySchedules[1].lessonTime, readJson.todaySchedules[2].lessonTime]
    let subject = [readJson.todaySchedules[0].subject, readJson.todaySchedules[1].subject, readJson.todaySchedules[2].subject]
    let auditory = [readJson.todaySchedules[0].auditory, readJson.todaySchedules[1].auditory, readJson.todaySchedules[2].auditory]
    let lesson_type = [readJson.todaySchedules[0].lessonType, readJson.todaySchedules[1].lessonType, readJson.todaySchedules[2].lessonType]

    new Vue({
        el: '#app',
        data: {
            subject: [subject[0], subject[1], subject[2]],
            auditory: [auditory[0], auditory[1], auditory[2]],
            lessonTime: [lessonTime[0], lessonTime[1], lessonTime[2]],
            lesson_type: [lesson_type[0], lesson_type[1], lesson_type[2]],
        }
    })
}
getinfo()