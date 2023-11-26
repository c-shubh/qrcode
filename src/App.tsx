import { CopyOutlined, DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Button,
  ColorPicker,
  Dropdown,
  Input,
  QRCode,
  Space,
  Typography,
} from "antd";
import * as htmlToImage from "html-to-image";
import { useState } from "react";
const { Text } = Typography;

const downloadDataUrl = ({
  dataUrl,
  fileName,
}: {
  dataUrl: string;
  fileName: string;
}) => {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = dataUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const downloadQRCode = async (type: "PNG" | "JPEG") => {
  const node = document.getElementById("qrcode")?.children[0] as HTMLElement;

  if (type === "PNG") {
    const dataUrl = await htmlToImage.toPng(node);
    const fileName = "qrcode.png";
    downloadDataUrl({ dataUrl, fileName });
  } else if (type === "JPEG") {
    const dataUrl = await htmlToImage.toJpeg(node);
    const fileName = "qrcode.jpeg";
    downloadDataUrl({ dataUrl, fileName });
  }
};

const copyToClipboard = async () => {
  const node = document.getElementById("qrcode")?.children[0] as HTMLElement;
  const blob = await htmlToImage.toBlob(node);
  if (blob !== null) {
    const data = [new window.ClipboardItem({ [blob.type]: blob })];
    await navigator.clipboard.write(data);
  }
};

export default function App() {
  const [text, setText] = useState("");
  const [background, setBackground] = useState("#ffffff");
  const [foreground, setForeground] = useState("#000000");
  const [isCopied, setIsCopied] = useState(false);
  const defaultText = "Enter text";
  const items: MenuProps["items"] = [
    { label: "PNG", key: "PNG", onClick: () => downloadQRCode("PNG") },
    { label: "JPEG", key: "JPEG", onClick: () => downloadQRCode("JPEG") },
  ];

  return (
    <Space direction="vertical" align="center">
      <div id="qrcode">
        <QRCode
          type="svg"
          value={text || defaultText}
          size={250}
          bgColor={background}
          color={foreground}
          bordered={false}
          style={{
            borderRadius: 0,
          }}
        />
      </div>
      <Input.TextArea
        placeholder={defaultText}
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <ColorPicker
        showText={(color) => (
          <span>
            Background <Text code>({color.toHexString()})</Text>
          </span>
        )}
        value={background}
        onChange={(_, hex) => setBackground(hex)}
      />
      <ColorPicker
        defaultValue={"#1f1f1f"}
        showText={(color) => (
          <span>
            Foreground <Text code>({color.toHexString()})</Text>
          </span>
        )}
        value={foreground}
        onChange={(_, hex) => setForeground(hex)}
      />
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button type="primary">
          <Space>
            Download
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <Button
        icon={<CopyOutlined />}
        onClick={() => {
          copyToClipboard();
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        }}
      >
        <span>{isCopied ? "Copied!" : "Copy to clipboard"}</span>
      </Button>
    </Space>
  );
}
