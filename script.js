console.log("JS")
let currSong = new Audio()
let songs;
let currfolder

function secondconvert(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const Minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const FormattedMinutes = String(Minutes).padStart(2, '0')
    const FormattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${FormattedMinutes}:${FormattedSeconds}`

}

async function getSongs(folder) {
    currfolder = folder
    let a = await fetch(`/song/${folder}`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songul = document.querySelector(".SongList").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + ` 
        <li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
            </div>
            <img class="invert" src="img/play.svg" alt="">
        </li>`
    }
    Array.from(document.querySelector(".SongList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });
    return songs
}

const PlayMusic = (track, pause = false) => {
    currSong.src = `/song/${currfolder}/` + track
    if (!pause) {
        currSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".SongInfo").innerHTML = decodeURI(track)
    document.querySelector(".SongTime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    let a = await fetch(`/song/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if (e.href.includes("/song")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`/song/${folder}/info.json`)
            let response = await a.json()
            console.log(response)
            let cardContainer = document.querySelector(".CardContainer")
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/song/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
            PlayMusic(songs[0])
        })
    })

}
async function main() {
    await getSongs("ncs");
    PlayMusic(songs[0], true)

    displayAlbums()

    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currSong.pause()
            play.src = "img/play.svg"
        }
    })



    currSong.addEventListener("timeupdate", () => {
        document.querySelector(".SongTime").innerHTML = `${secondconvert(currSong.currentTime)}/${secondconvert(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%"
    })

    document.querySelector(".SeekBar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width * 100)
        document.querySelector(".circle").style.left = percent + "%"
        currSong.currentTime = (currSong.duration * percent) / 100
    })

    document.querySelector(".hambarger").addEventListener(("click"), () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener(('click'), () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        currSong.pause()
        console.log("Previous click")
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            PlayMusic(songs[index - 1])

        }
    })

    next.addEventListener("click", () => {
        currSong.pause()
        console.log("next click")
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            PlayMusic(songs[index + 1])

        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to ", e.target.value, "/100")
        currSong.volume = parseInt(e.target.value) / 100
        if (currSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

    
}

main()