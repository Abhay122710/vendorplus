import { useState, useEffect } from "react";
import { Brain, AlertTriangle, TrendingUp, Lightbulb, RefreshCw, Loader2, Zap, ShieldAlert, Flame, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";
import { predict, getModelMeta, ML_MODEL_INFO, ML_PIPELINE_STAGES, type MLPrediction, type MLModelMeta } from "@/lib/ml/client";
import { fetchPrediction, ML_API_INFO, type MLApiPrediction } from "@/lib/ml/api";

export default function DashboardSmartAI() {
  const { tr, lang } = useLanguage();
  const [data, setData] = useState<MLPrediction | null>(null);
  const [meta, setMeta] = useState<MLModelMeta | null>(null);
  const [apiPrediction, setApiPrediction] = useState<MLApiPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAI = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the Random Forest model (loaded from ml-model/outputs/model_bundle.json)
      const [prediction, modelMeta] = await Promise.all([
        predict({ weather: "hot", stock: "low", stock_count: 10, sales: 80, time: "afternoon" }),
        getModelMeta(),
      ]);
      setData(prediction);
      setMeta(modelMeta);
      // Fetch live prediction from FastAPI service (ml-api/main.py)
      const apiPred = await fetchPrediction();
      setApiPrediction(apiPred);
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAI(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{tr("smartAI.loading")}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error || tr("smartAI.noData")}</p>
        <Button variant="outline" size="sm" onClick={fetchAI}>
          <RefreshCw className="h-4 w-4 mr-2" /> {tr("smartAI.retry")}
        </Button>
      </div>
    );
  }

  const isUrgentStock = data.stock_alert?.toLowerCase().includes("urgent") ||
    data.stock_alert?.toLowerCase().includes("low") ||
    data.stock_alert?.toLowerCase().includes("restock") ||
    data.stock_alert?.toLowerCase().includes("alert");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">{tr("smartAI.title")}</h2>
          <Badge variant="secondary" className="ml-2 text-[10px] uppercase tracking-wide">
            Trained Model · RF
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {tr("smartAI.connected")}
          </Badge>
          <Button variant="ghost" size="icon" onClick={fetchAI} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ML model meta strip */}
      <div className="rounded-lg border bg-muted/40 px-4 py-2 text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
        <span><span className="font-semibold text-foreground">Model:</span> {ML_MODEL_INFO.algorithm} · v{ML_MODEL_INFO.version}</span>
        {meta && (
          <>
            <span><span className="font-semibold text-foreground">Trained on:</span> {meta.row_count.toLocaleString()} rows</span>
            <span><span className="font-semibold text-foreground">Updated:</span> {new Date(meta.generated_at).toLocaleString()}</span>
          </>
        )}
        <span className="ml-auto opacity-70">Bundle: <code>{ML_MODEL_INFO.bundle}</code></span>
      </div>

      {/* ML pipeline visualisation */}
      <div className="rounded-lg border bg-background px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inference Pipeline</span>
          <span className="text-[10px] text-muted-foreground">{ML_MODEL_INFO.features.length} features</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {ML_PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1" title={stage.file}>
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-foreground">{stage.label}</span>
              </div>
              {i < ML_PIPELINE_STAGES.length - 1 && (
                <span className="text-muted-foreground text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live FastAPI prediction card */}
      {apiPrediction && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Live ML API Prediction
              </span>
              <Badge variant="outline" className="text-[10px] gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                {ML_API_INFO.framework} · GET {ML_API_INFO.endpoint}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 flex-wrap">
              <div>
                <p className="text-3xl font-bold text-primary">{apiPrediction.prediction}</p>
                <p className="text-xs text-muted-foreground">{apiPrediction.label}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">Demand: {apiPrediction.demand_level}</Badge>
                  <Badge variant="secondary" className="text-[10px]">Top: {apiPrediction.top_product}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{apiPrediction.area} · {apiPrediction.season}</Badge>
                  <Badge variant="secondary" className="text-[10px]">Revenue ₹{apiPrediction.revenue_potential.toLocaleString()}</Badge>
                </div>
              </div>
              <div className="ml-auto text-right text-xs text-muted-foreground space-y-0.5">
                <p>Confidence: <span className="font-semibold text-foreground">{(apiPrediction.confidence * 100).toFixed(1)}%</span></p>
                <p>Accuracy: <span className="font-semibold text-foreground">{(apiPrediction.accuracy * 100).toFixed(1)}%</span></p>
                <p>Model v{apiPrediction.model_version}</p>
                <p className="opacity-70">{new Date(apiPrediction.generated_at).toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Demand Card */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              {tr("smartAI.demandLevel")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{data.demand}</p>
          </CardContent>
        </Card>

        {/* Trending Card */}
        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              {tr("smartAI.trendingProduct")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="text-sm bg-orange-500/20 text-orange-700 border-orange-500/30 hover:bg-orange-500/30">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              {trd(data.trending, lang)}
            </Badge>
          </CardContent>
        </Card>

        {/* Stock Alert Card */}
        <Card className={`${isUrgentStock ? "border-destructive/50 bg-gradient-to-br from-destructive/5 to-destructive/10" : "border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10"}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {isUrgentStock ? <ShieldAlert className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-green-600" />}
              {tr("smartAI.stockStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm font-semibold ${isUrgentStock ? "text-destructive" : "text-green-700"}`}>
              {data.stock_alert}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            {tr("smartAI.recommendation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-foreground leading-relaxed">{data.recommendation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Section */}
      {data.explanation && data.explanation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-5 w-5 text-primary" />
              {tr("smartAI.breakdown")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.explanation.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
