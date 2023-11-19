<div className="repairsPanelDiscBlock">
                <div className="dataInRepairItem">
                  <Title
                    level="1"
                    weight="1"
                    style={{
                      textAlign: "center",
                      color: "#424242",
                    }}
                  >
                    20
                  </Title>
                  <Title
                    level="3"
                    style={{
                      textAlign: "center",
                      color: "#686868",
                      marginTop: -10,
                    }}
                  >
                    окт
                  </Title>
                </div>
                <Text>
                  <span
                    style={{ color: "#010101" }}
                    className="repairDiscription"
                  >
                    {elem.description}{" "}
                  </span>
                  <span>· {elem.repairValue}руб</span>
                </Text>
              </div>
              <Title>{elem.title}</Title>
              <div className="repairsPanelDiscBlock">{elem.description} </div>


              before={
                <AdaptiveIconRenderer
                  IconCompact={
                    platform === Platform.IOS
                      ? Icon20DeleteOutline
                      : Icon20DeleteOutlineAndroid
                  }
                  IconRegular={
                    platform === Platform.IOS
                      ? Icon28DeleteOutline
                      : Icon28DeleteOutlineAndroid
                  }
                />
              }




              <Div key={index} className="repairsPanelDiscBlockAS">
              <div className="repairsDateBlock">
                <div className="dataInRepairItem">
                  <Title
                    level="1"
                    weight="1"
                    style={{
                      textAlign: "center",
                      color: "#424242",
                    }}
                  >
                    {new Date(elem.created).getDate()}
                  </Title>
                  <Title
                    level="3"
                    style={{
                      textAlign: "center",
                      color: "#686868",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    {Months[new Date(elem.created).getMonth()]}
                  </Title>
                </div>
              </div>
              <div
                style={{
                  display: "inline-block",
                  maxWidth: 240,
                  maxHeight: 90,
                  marginLeft: 15,
                }}
              >
                <Title className="repairsPanelName">{elem.title}</Title>
                <Text className="repairsPanelDisc">
                  {elem.description} ·
                  <span
                    style={{ color: "#5A5A5A" }}
                    className="repairsPanelDiscSpan"
                  >
                    {elem.repairValue}руб
                  </span>
                </Text>
              </div>
            </Div>