import { Icon28CarOutline } from "@vkontakte/icons";
import { Card, Image, Spinner, Text, Title } from "@vkontakte/vkui";
import "../Garage.css";

const CarCard = ({ rt, data, setCurrentCar, setPopout, setCarData }) => {
  return (
    <div className="lvl-card-div">
      <Card
        key={data.spz}
        mode="outline"
        style={{ borderRadius: 24 }}
        onClick={() => {
          setCurrentCar(data);
          setPopout(<Spinner size="large" />);
          rt.push(`/carPanel/${data.id}`);
        }}
      >
        <div className="lvl-card">
          <div className="car-photo-div">
            {data.fileUrl ? (
              <Image
                size={56}
                className="car-photo"
                withBorder={false}
                borderRadius="l"
                src={"https://showtime.app-dich.com/" + data.fileUrl}
              />
            ) : (
              <Icon28CarOutline width={56} height={56} />
            )}
          </div>

          <div className="text-block">
            <Title
              level="1"
              className="car-card-title"
              style={{ overflow: "hidden" }}
            >
              {data.name}, {data.releaseYear}
            </Title>

            <Text
              className="lvl-card-parametr-text"
              style={{
                paddingTop: 4,
                overflow: "hidden",
              }}
            >
              {data.spz}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CarCard;
