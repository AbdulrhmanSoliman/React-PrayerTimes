import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Prayer from "./Prayer";
import { useState, useEffect } from "react";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function Allcontent() {
  // States
  let [prayerTimes, setPrayerTimes] = useState({
    Fajr: "4:20",
    Dhuhr: "12:00",
    Asr: "15:9",
    Maghrib: "18: 20",
    Isha: "19:50",
  });
  let [city, setCity] = useState({
    displayName: "القاهرة",
    apiName: "cairo",
  });
  let [today, setToday] = useState("");
  let [hour, setHour] = useState("");
  let [hijriDate, setHijriDate] = useState({});
  let [nextPrayerIndex, setNextPrayerIndex] = useState("0");
  let [remainTime, setRemainTime] = useState({});
  let prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Duhur", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  let getData = async () => {
    let res = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${city.apiName}&country=EG&method=5`
    );
    setPrayerTimes(res.data.data.timings);
    setHijriDate(res.data.data.date.hijri);
  };
  useEffect(() => {
    getData();
    let time = moment();
    setToday(time.format("Do MMM YYYY"));
    setHour(time.format("الوقت الأن hh:mm"));
  }, [city]);

  useEffect(() => {
    let timer = setInterval(() => {
      setupCountDown();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  function setupCountDown() {
    let momentNow = moment();
    let nextPrayer;
    if (
      momentNow.isAfter(moment(prayerTimes.Fajr, "hh:mm")) &&
      momentNow.isBefore(moment(prayerTimes.Dhuhr, "hh:mm"))
    ) {
      nextPrayer = 1;
    } else if (
      momentNow.isAfter(moment(prayerTimes.Dhuhr, "hh:mm")) &&
      momentNow.isBefore(moment(prayerTimes.Asr, "hh:mm"))
    ) {
      nextPrayer = 2;
    } else if (
      momentNow.isAfter(moment(prayerTimes.Asr, "hh:mm")) &&
      momentNow.isBefore(moment(prayerTimes.Maghrib, "hh:mm"))
    ) {
      nextPrayer = 3;
    } else if (
      momentNow.isAfter(moment(prayerTimes.Maghrib, "hh:mm")) &&
      momentNow.isBefore(moment(prayerTimes.Isha, "hh:mm"))
    ) {
      nextPrayer = 4;
    } else {
      nextPrayer = 0;
    }
    setNextPrayerIndex(nextPrayer);
    // after getting the upcoming prayer
    const nextPrayerObject = prayersArray[nextPrayer];
    const nextPrayerTime = prayerTimes[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    // Fajr difference time
    if (remainingTime < 0) {
      let midNightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow); // part 1
      let fajrTomidNightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss") // part 2
      );
      let totalDiff = midNightDiff + fajrTomidNightDiff;
      remainingTime = totalDiff;
    }
    let durationTimeDiff = moment.duration(remainingTime);
    setRemainTime({
      hours: durationTimeDiff.hours(),
      minutes: durationTimeDiff.minutes(),
      seconds: durationTimeDiff.seconds(),
    });
  }
  // Objects
  let allCities = [
    {
      displayName: "القاهرة",
      apiName: "cairo",
    },
    {
      displayName: "الجيزة",
      apiName: "giza",
    },
    {
      displayName: "المنصورة",
      apiName: "mansoura",
    },
    {
      displayName: "أسوان",
      apiName: "aswan",
    },
  ];
  function handleCityChange(e) {
    const cityObject = allCities.find((city) => e === city.apiName);
    setCity(cityObject);
  }
  return (
    <Stack alignItems={"center"}>
      <Stack
        direction={"row"}
        gap={5}
        flexWrap={"wrap"}
        marginBlock={"20px"}
        justifyContent={"center"}
      >
        {/* Countries List */}

        <FormControl style={{ minWidth: "200px" }}>
          <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={city.apiName}
            label="choose"
            onChange={(e) => handleCityChange(e.target.value)}
          >
            {allCities.map((c, index) => {
              return (
                <MenuItem key={index} value={c.apiName}>
                  {c.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>

      {/* Main Content */}

      <div className="content">
        <Grid container>
          <Grid xs={5}>
            <div>
              <p style={{ fontSize: "1.5rem" }}>
                {today} |{"  "}
                {`${hijriDate.day}  ${hijriDate.month.ar} ${hijriDate.year}`}
              </p>
              <h1 style={{ color: "#999" }}>{city.displayName}</h1>
            </div>
          </Grid>
          <Grid xs={5}>
            <div>
              <p style={{ fontSize: "1.5rem" }}>
                متبقي حتى اذان {prayersArray[nextPrayerIndex].displayName}{" "}
              </p>
              <p style={{ color: "#999", fontSize: "2rem" }}>
                <span>{remainTime.seconds} : </span>
                <span>{remainTime.minutes} : </span>
                <span>{remainTime.hours} </span>
              </p>
            </div>
          </Grid>
          <Grid xs={2}>
            <div>
              <p style={{ fontSize: "1.5rem" }}>{hour}</p>
            </div>
          </Grid>
        </Grid>
        <Divider color={"#777"} style={{ marginBlock: "1.5rem" }} />
        <Stack
          direction={"row"}
          gap={2}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          <Prayer
            name="الفجر"
            time={prayerTimes.Fajr}
            img="./src/assets/images/جامع-السلطان-أحمد-أو-الجامع-الأزرق.jpg"
            active={nextPrayerIndex === 0}
          />
          <Prayer
            name="الظهر"
            time={prayerTimes.Dhuhr}
            img="./src/assets/images/منظر-للجامع-الجديد-أو-يني-جامع.jpg"
            active={nextPrayerIndex === 1}
          />
          <Prayer
            name="العصر"
            time={parseInt(prayerTimes.Asr) - 12 + prayerTimes.Asr.slice(2)}
            img="./src/assets/images/صورة-من-داخل-مسجد-بيازيد.jpg"
            active={nextPrayerIndex === 2}
          />
          <Prayer
            name="المغرب"
            time={
              parseInt(prayerTimes.Maghrib) - 12 + prayerTimes.Maghrib.slice(2)
            }
            img="./src/assets/images/مسجد-كوكاتيب-أنقرة.jpg"
            active={nextPrayerIndex === 3}
          />
          <Prayer
            name="العشاء"
            time={parseInt(prayerTimes.Isha) - 12 + prayerTimes.Isha.slice(2)}
            img="./src/assets/images/جامع-السليمانية.jpg"
            active={nextPrayerIndex === 4}
          />
        </Stack>
      </div>
    </Stack>
  );
}
// 9 سبتمبر 2024 | 4:50
