
let hours = `00`,
    minutes = `00`,
    seconds = `00`,
    chronometerCall

function chronometer() {
    seconds++
    if (seconds < 10) seconds = `0`+seconds

    if (seconds > 59) {
        seconds = `00`
        minutes ++

        if (minutes < 10) minutes = `0`+minutes
    }
    if (minutes > 59) {
        minutes = `00`
        hours ++
    }
    document.querySelector(`[data-chronometer]`)
            .textContent = `${hours}:${minutes}:${seconds}`

}
function play() {
    chronometerCall = setInterval(chronometer, 1000)
}