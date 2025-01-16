import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const COINCAP_API_URL = "https://api.coincap.io/v2/assets";

export default function IndexPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetch(COINCAP_API_URL)
      .then((response) => response.json())
      .then((data) => setAssets(data.data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="container mx-auto px-4 py-16 space-y-32">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Badge variant="secondary" className="mb-4">
          Welcome to Your Crypto Dashboard
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Track Your Crypto Assets
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Stay updated with the latest market trends.
        </p>
        <Button size="lg" className="mt-4" onClick={() => navigate('/dashboard')}>
          View sample dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.section>

      {/* Assets Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-3"
      >
        {assets.map((asset) => (
          <motion.div key={asset.id} variants={fadeInUp} onClick={() => handleAssetClick(asset)}>
            <Card className="cursor-pointer">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold">{asset.name}</h3>
                <p className="text-muted-foreground">Market Cap: ${parseFloat(asset.marketCapUsd).toLocaleString()}</p>
                <p className="text-muted-foreground">Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{selectedAsset.name} Details</h2>
            <ChartContainer config={{}}>
              {/* Chart data goes here */}
            </ChartContainer>
            <Button className="mt-4" onClick={() => setSelectedAsset(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
