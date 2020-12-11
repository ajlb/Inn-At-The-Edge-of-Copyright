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

export default startShoutTimer;

export { startShoutTimer }