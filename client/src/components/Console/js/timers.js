function disableEnterKey(event) {
    event.preventDefault();
    console.log(event.key);
    document.getElementById("inputBar").value = "...you are momentarily quite busy";
}


function startShoutTimer(setMuted) {
    setMuted(true);
    let secondsLeft = 10
    const timer = setInterval(() => {
        secondsLeft--
        if (secondsLeft === 0) {
            setMuted(false)
            clearInterval(timer)
        } else {
            setMuted({ secondsLeft })
        }
    }, [1000])
}

function startCurrentlyAttackingTimer({ setActivities, activities }) {
    setActivities({
        ...activities,
        currentlyAttacking: true,
        fighting: true
    });
    let secondsLeft = 2
    const timer = setInterval(() => {
        secondsLeft--
        if (secondsLeft === 0) {
            setActivities({
                ...activities,
                currentlyAttacking: false,
                fighting: true
            })
            clearInterval(timer)
        } else {
            setActivities({
                ...activities,
                currentlyAttacking: secondsLeft
            })
        }
    }, [1000])
}


function startDisableInputTimer() {
    let halfSecondsLeft = 4
    document.getElementById('submit-button').disabled = true;
    document.addEventListener("keypress", disableEnterKey);
    const timer = setInterval(() => {
        halfSecondsLeft--
        if (halfSecondsLeft === 0) {
            document.getElementById('submit-button').disabled = false;
            document.removeEventListener("keypress", disableEnterKey);
            clearInterval(timer)
        }
    }, [500])
}


export default startShoutTimer;

export {
    startShoutTimer,
    startCurrentlyAttackingTimer,
    startDisableInputTimer
}