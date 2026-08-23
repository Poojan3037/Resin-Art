import { Column, Row, Text } from "@react-email/components";
import { detailLabel, detailValue } from "./css";

type PropsType = {
  label: string;
  value: string;
};

const DetailRow = ({ label, value }: PropsType) => {
  return (
    <Row style={{ marginBottom: "10px" }}>
      <Column style={{ width: "35%" }}>
        <Text style={detailLabel}>{label}</Text>
      </Column>
      <Column style={{ width: "65%", textAlign: "right" }}>
        <Text style={detailValue}>{value}</Text>
      </Column>
    </Row>
  );
};

export default DetailRow;
