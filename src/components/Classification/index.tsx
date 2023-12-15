import { StyleSheet, View, Text } from "react-native";

export type ClassificationProps = {
  probability: number;
  className: string;
};

type Props = {
  data: ClassificationProps;
};

export function Classification({ data }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.probability}>{data.probability.toFixed(4)}</Text>

      <Text style={styles.className}>{data.className}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#292728",
    flexDirection: "row",
    borderRadius: 7,
    overflow: "hidden",
  },
  probability: {
    backgroundColor: "#621aC4",
    padding: 12,
    color: "#FFF",
  },
  className: {
    padding: 12,
    color: "#FFF",
  },
});
