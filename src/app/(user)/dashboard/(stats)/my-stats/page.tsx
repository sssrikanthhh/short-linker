"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loader, TrendingDown, TrendingUp } from "lucide-react";

import { Url } from "@/lib/types";
import { getUserUrls } from "@/actions/url/get-user-urls";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

type StatsPageProps = {};

export default function MyStatsPage() {
  const { data: session, status } = useSession();
  const [userUrls, setUserUrls] = useState<
    Pick<
      Url,
      "id" | "originalUrl" | "shortCode" | "clicks" | "createdAt" | "updatedAt"
    >[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated" && session?.user?.id) {
      const fetchUserUrls = async () => {
        try {
          if (!session?.user?.id) return;
          const response = await getUserUrls(session?.user?.id);
          if (response.success && response.data) {
            setUserUrls(response.data.userUrls);
          }
        } catch (error) {
          console.log("Failed to fetch user URLs: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserUrls();
    }
  }, [session, status]);

  const totalClicks = userUrls.reduce((acc, url) => acc + url.clicks, 0);

  //average clicks per url
  const averageClicks =
    userUrls.length > 0
      ? Math.round((totalClicks / userUrls.length) * 10) / 10
      : 0;

  //top performing urls
  const topUrls = userUrls.toSorted((a, b) => b.clicks - a.clicks).slice(0, 5);

  //data for bar chart
  const barChartData = useMemo(() => {
    return topUrls.map((url, index) => ({
      url: url.shortCode,
      clicks: url.clicks,
      originalUrl: url.originalUrl,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [topUrls]);

  //data for pie chart
  const pieChartData = useMemo(() => {
    return topUrls.map((url, index) => ({
      browser: url.shortCode,
      visitors: url.clicks,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [topUrls]);

  //bar chart config
  const barChartConfig = {
    clicks: {
      label: "Clicks",
      color: "hsl(var(--chart-1))",
    },
    ...topUrls.reduce((acc, url, index) => {
      acc[url.shortCode] = {
        label: url.shortCode,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    }, {} as ChartConfig),
  };

  //pie chart config
  const pieChartConfig = {
    visitors: {
      label: "Clicks",
    },
    ...topUrls.reduce((acc, url, index) => {
      acc[url.shortCode] = {
        label: url.shortCode,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    }, {} as ChartConfig),
  };

  if (status === "loading" || isLoading)
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader className="size-8 animate-spin" />
      </div>
    );

  return (
    <>
      <h1 className="mb-8 text-center text-3xl font-medium">Url Statistics</h1>

      <div className="mb-8 grid gap-8 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Total URLs</CardTitle>
            <CardDescription>
              Number of URLs you have created with Short Linker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-medium">{userUrls.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>Total click across all your URLs.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-medium">{totalClicks}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Average Clicks</CardTitle>
            <CardDescription>Average clicks per URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-medium">{averageClicks}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Top Performing URLs</CardTitle>
          <CardDescription>
            Top 5 URLs with the highest number of clicks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {barChartData.length > 0 ? (
            <Tabs defaultValue="bar" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="bar">Bar chart</TabsTrigger>
                <TabsTrigger value="pie">Pie chart</TabsTrigger>
              </TabsList>
              <TabsContent value="bar" className="mt-4 min-h-[400px]">
                <Card>
                  <CardHeader>
                    <CardTitle>URL performace</CardTitle>
                    <CardDescription>
                      Top 5 URLs with the highest number of clicks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={barChartConfig}>
                      <BarChart accessibilityLayer data={barChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="url"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              indicator="dashed"
                              labelFormatter={(label) => `URL: ${label}`}
                            />
                          }
                        />
                        <Bar dataKey="clicks" radius={4}>
                          {barChartData.map((data, index) => (
                            <Cell key={`cell-${index}`} fill={data.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 leading-none font-medium">
                      {averageClicks > 5 ? (
                        <div className="flex items-center gap-1">
                          <span>
                            Trending up by{" "}
                            {((averageClicks / 5) * 100).toFixed(1)}% this
                            month.
                          </span>
                          <TrendingUp className="size-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span>
                            Could improve with {(5 - averageClicks).toFixed(1)}{" "}
                            more clicks.
                          </span>
                          <TrendingDown className="size-5 text-amber-500" />
                        </div>
                      )}
                    </div>
                    <div className="text-muted-foreground leading-none">
                      showing click count for the top {topUrls.length} URLs
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="pie" className="mt-4 min-h-[400px]">
                <Card>
                  <CardHeader className="items-center pb-0">
                    <CardTitle>URL click distribution</CardTitle>
                    <CardDescription>
                      Top {topUrls.length} URLs with the highest number of
                      clicks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={pieChartConfig}
                      className="mx-auto aspect-square max-h-[350px]"
                    >
                      <PieChart accessibilityLayer data={pieChartData}>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={pieChartData}
                          dataKey="visitors"
                          nameKey="browser"
                          innerRadius={60}
                          strokeWidth={5}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-3xl font-medium"
                                    >
                                      {totalClicks.toLocaleString()}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 20) + 20}
                                      className="fill-muted-foreground"
                                    >
                                      Total clicks
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          ></Label>
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-center gap-2 text-sm">
                    <div className="flex items-center gap-2 leading-none font-medium">
                      {userUrls.length > 0 && (
                        <>
                          {averageClicks > 5 ? (
                            <>
                              <div className="flex items-center gap-1">
                                <span>
                                  Trending up by{" "}
                                  {((averageClicks / 5) * 100).toFixed(1)}% this
                                  month.
                                </span>
                                <TrendingUp className="size-5 text-green-500" />
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span>
                                Could improve with{" "}
                                {(5 - averageClicks).toFixed(1)} more clicks.
                              </span>
                              <TrendingDown className="size-5 text-amber-500" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-muted-foreground leading-none">
                      Showing the click count for the top {topUrls.length} URLs
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              You don&apos;t have any short links data available yet. Create
              some to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
