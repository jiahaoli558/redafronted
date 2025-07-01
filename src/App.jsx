import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, Shield, AlertTriangle, BarChart3, Users, Bell, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import './App.css'

// API配置
const API_BASE_URL = '/api'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({})
  const [trendingCompanies, setTrendingCompanies] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 获取平台统计信息
  useEffect(() => {
    fetchStats()
    fetchTrendingCompanies()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('获取统计信息失败:', error)
    }
  }

  const fetchTrendingCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trending`)
      const data = await response.json()
      if (data.success) {
        setTrendingCompanies(data.data.slice(0, 5))
      }
    } catch (error) {
      console.error('获取热门公司失败:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        if (data.data.length > 0) {
          setSelectedCompany(data.data[0])
        }
      } else {
        alert(data.error || '搜索失败')
      }
    } catch (error) {
      console.error('搜索失败:', error)
      alert('搜索服务暂时不可用，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case '低风险':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case '中风险':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case '高风险':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num?.toString() || '0'
  }

  const formatPrice = (price) => {
    return price ? price.toFixed(2) : '0.00'
  }

  const formatPercent = (percent) => {
    const value = parseFloat(percent) || 0
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">投资雷达</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">首页</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">功能</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">定价</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">关于</a>
                <Button variant="outline" size="sm">登录</Button>
                <Button size="sm">注册</Button>
              </div>
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">首页</a>
              <a href="#" className="text-gray-500 block px-3 py-2 rounded-md text-base font-medium">功能</a>
              <a href="#" className="text-gray-500 block px-3 py-2 rounded-md text-base font-medium">定价</a>
              <a href="#" className="text-gray-500 block px-3 py-2 rounded-md text-base font-medium">关于</a>
              <div className="flex space-x-2 px-3 py-2">
                <Button variant="outline" size="sm">登录</Button>
                <Button size="sm">注册</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero区域 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            智能识别投资风险
            <span className="block text-blue-600">保护您的每一分投资</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            实时监控上市公司动态，智能分析正面负面信息，让投资决策更明智，风险控制更精准
          </p>
          
          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="输入公司名称或股票代码，如：腾讯、00700.HK"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                size="lg"
                className="h-12 px-8"
              >
                {loading ? '搜索中...' : '立即搜索'}
              </Button>
            </div>
          </div>

          {/* 平台统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_companies || 0}</div>
              <div className="text-sm text-gray-500">覆盖公司</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.total_searches || 0}</div>
              <div className="text-sm text-gray-500">查询次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.high_risk_companies || 0}</div>
              <div className="text-sm text-gray-500">高风险公司</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.recent_updates || 0}</div>
              <div className="text-sm text-gray-500">今日更新</div>
            </div>
          </div>
        </div>
      </section>

      {/* 搜索结果区域 */}
      {searchResults.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">搜索结果</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 公司列表 */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  {searchResults.map((company, index) => (
                    <Card 
                      key={company.id || index}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCompany?.id === company.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedCompany(company)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{company.name}</h3>
                            <p className="text-sm text-gray-500">{company.symbol}</p>
                          </div>
                          <Badge className={getRiskBadgeColor(company.risk_level)}>
                            {company.risk_level}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              ¥{formatPrice(company.current_price)}
                            </span>
                            {company.change_percent && (
                              <span className={`ml-2 text-sm ${
                                company.change_percent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatPercent(company.change_percent)}
                              </span>
                            )}
                          </div>
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 公司详情 */}
              <div className="lg:col-span-2">
                {selectedCompany && (
                  <div className="space-y-6">
                    {/* 公司基本信息 */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl">{selectedCompany.name}</CardTitle>
                            <CardDescription>{selectedCompany.symbol} • {selectedCompany.exchange}</CardDescription>
                          </div>
                          <Badge className={getRiskBadgeColor(selectedCompany.risk_level)}>
                            {selectedCompany.risk_level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">当前价格</p>
                            <p className="text-xl font-bold">¥{formatPrice(selectedCompany.current_price)}</p>
                          </div>
                          {selectedCompany.change && (
                            <div>
                              <p className="text-sm text-gray-500">涨跌额</p>
                              <p className={`text-xl font-bold ${
                                selectedCompany.change >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {selectedCompany.change >= 0 ? '+' : ''}{formatPrice(selectedCompany.change)}
                              </p>
                            </div>
                          )}
                          {selectedCompany.volume && (
                            <div>
                              <p className="text-sm text-gray-500">成交量</p>
                              <p className="text-xl font-bold">{formatNumber(selectedCompany.volume)}</p>
                            </div>
                          )}
                          {selectedCompany.market_cap && (
                            <div>
                              <p className="text-sm text-gray-500">市值</p>
                              <p className="text-xl font-bold">¥{formatNumber(selectedCompany.market_cap)}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 新闻信息 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>相关资讯</CardTitle>
                        <CardDescription>最新的公司动态和市场信息</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="positive" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="positive" className="text-green-600">
                              正面信息 ({selectedCompany.news?.filter(n => n.sentiment === '正面').length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="negative" className="text-red-600">
                              负面信息 ({selectedCompany.news?.filter(n => n.sentiment === '负面').length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="neutral" className="text-gray-600">
                              中性信息 ({selectedCompany.news?.filter(n => n.sentiment === '中性').length || 0})
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="positive" className="space-y-4">
                            {selectedCompany.news?.filter(n => n.sentiment === '正面').map((news, index) => (
                              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                                <h4 className="font-medium text-gray-900">{news.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{news.content}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">{news.source}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(news.published_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )) || <p className="text-gray-500">暂无正面信息</p>}
                          </TabsContent>
                          
                          <TabsContent value="negative" className="space-y-4">
                            {selectedCompany.news?.filter(n => n.sentiment === '负面').map((news, index) => (
                              <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                                <h4 className="font-medium text-gray-900">{news.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{news.content}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">{news.source}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(news.published_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )) || <p className="text-gray-500">暂无负面信息</p>}
                          </TabsContent>
                          
                          <TabsContent value="neutral" className="space-y-4">
                            {selectedCompany.news?.filter(n => n.sentiment === '中性').map((news, index) => (
                              <div key={index} className="border-l-4 border-gray-500 pl-4 py-2">
                                <h4 className="font-medium text-gray-900">{news.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{news.content}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">{news.source}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(news.published_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )) || <p className="text-gray-500">暂无中性信息</p>}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 热门公司 */}
      {trendingCompanies.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">热门关注</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {trendingCompanies.map((company, index) => (
                <Card key={company.id || index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{company.name}</h3>
                        <p className="text-sm text-gray-500">{company.symbol}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {company.search_count}次
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">¥{formatPrice(company.current_price)}</span>
                      <Badge className={getRiskBadgeColor(company.risk_level)}>
                        {company.risk_level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 功能特色 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择投资雷达？</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们提供全方位的投资风险识别服务，让您的投资决策更加明智
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">智能搜索</h3>
              <p className="text-gray-600">支持公司名称、股票代码多种搜索方式，快速定位目标公司</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">实时数据</h3>
              <p className="text-gray-600">实时获取股价、财务数据和市场动态，确保信息时效性</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">风险预警</h3>
              <p className="text-gray-600">智能识别负面信息，提供风险等级评估，帮您规避投资陷阱</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">智能分析</h3>
              <p className="text-gray-600">自动分析新闻情感倾向，分类展示正面负面信息</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">投资雷达</span>
              </div>
              <p className="text-gray-400">
                智能投资风险识别平台，保护您的每一分投资
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">产品功能</h3>
              <ul className="space-y-2 text-gray-400">
                <li>公司搜索</li>
                <li>风险评估</li>
                <li>实时数据</li>
                <li>智能分析</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">帮助支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li>使用指南</li>
                <li>常见问题</li>
                <li>联系客服</li>
                <li>意见反馈</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <ul className="space-y-2 text-gray-400">
                <li>邮箱：contact@investor-radar.com</li>
                <li>电话：400-123-4567</li>
                <li>地址：北京市朝阳区金融街</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 投资雷达. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

