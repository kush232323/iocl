import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ChevronDown,
  Calendar,
  CheckCircle,
  User,
  Globe,
  FileText,
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  Zap,
  Shield,
  Gauge,
  Hash,
  Tag,
  Activity,
  Settings,
  Clock,
  Radio,
  Cpu
} from "lucide-react";

// API Configuration
const API_BASE = "http://192.168.0.109:5000/api";

// =============================================
// DEMO DATA - EXACT IOCL MOTOR MEGGER FORMAT
// =============================================
const DEMO_TESTS = [
  {
    id: 1,
    s_no: 1,
    equipment_name: "Main Incomer Motor",
    kw_rating: "75 KW",
    uv_value: "550",
    vw_value: "560",
    wu_value: "555",
    ue_value: "500",
    ve_value: "505",
    we_value: "510",
    remarks: "Insulation values satisfactory",
    test_date: "2024-01-15",
    status: "Passed",
    tested_by: "Rajesh Kumar",
    created_by: 1
  },
  {
    id: 2,
    s_no: 2,
    equipment_name: "Compressor Motor",
    kw_rating: "45 KW",
    uv_value: "480",
    vw_value: "485",
    wu_value: "490",
    ue_value: "450",
    ve_value: "455",
    we_value: "460",
    remarks: "Values within acceptable range",
    test_date: "2024-01-20",
    status: "Passed",
    tested_by: "Rajesh Kumar",
    created_by: 1
  },
  {
    id: 3,
    s_no: 3,
    equipment_name: "Conveyor Motor",
    kw_rating: "30 KW",
    uv_value: "420",
    vw_value: "415",
    wu_value: "425",
    ue_value: "400",
    ve_value: "405",
    we_value: "410",
    remarks: "Slight drop in values, monitoring required",
    test_date: "2024-02-01",
    status: "Passed",
    tested_by: "Suresh Patel",
    created_by: 1
  },
  {
    id: 4,
    s_no: 4,
    equipment_name: "Chiller Motor",
    kw_rating: "55 KW",
    uv_value: "600",
    vw_value: "610",
    wu_value: "605",
    ue_value: "550",
    ve_value: "555",
    we_value: "560",
    remarks: "Excellent insulation resistance",
    test_date: "2024-02-10",
    status: "Passed",
    tested_by: "Rajesh Kumar",
    created_by: 1
  },
  {
    id: 5,
    s_no: 5,
    equipment_name: "Pump House Motor",
    kw_rating: "22 KW",
    uv_value: "350",
    vw_value: "345",
    wu_value: "355",
    ue_value: "320",
    ve_value: "325",
    we_value: "330",
    remarks: "Low values, retest scheduled",
    test_date: "2024-02-15",
    status: "Pending",
    tested_by: "Suresh Patel",
    created_by: 1
  },
  {
    id: 6,
    s_no: 6,
    equipment_name: "Cooling Tower Motor",
    kw_rating: "37 KW",
    uv_value: "500",
    vw_value: "510",
    wu_value: "505",
    ue_value: "480",
    ve_value: "485",
    we_value: "490",
    remarks: "Satisfactory",
    test_date: "2024-03-01",
    status: "Passed",
    tested_by: "Rajesh Kumar",
    created_by: 1
  },
  {
    id: 7,
    s_no: 7,
    equipment_name: "Lighting Panel Motor",
    kw_rating: "15 KW",
    uv_value: "450",
    vw_value: "455",
    wu_value: "460",
    ue_value: "420",
    ve_value: "425",
    we_value: "430",
    remarks: "Good performance",
    test_date: "2024-03-10",
    status: "Passed",
    tested_by: "Rajesh Kumar",
    created_by: 1
  },
  {
    id: 8,
    s_no: 8,
    equipment_name: "Blower Motor",
    kw_rating: "30 KW",
    uv_value: "380",
    vw_value: "375",
    wu_value: "385",
    ue_value: "350",
    ve_value: "355",
    we_value: "360",
    remarks: "Values dropping, schedule retest",
    test_date: "2024-03-15",
    status: "In Progress",
    tested_by: "Suresh Patel",
    created_by: 1
  },
  {
    id: 9,
    s_no: 9,
    equipment_name: "AHU Motor",
    kw_rating: "22 KW",
    uv_value: "520",
    vw_value: "525",
    wu_value: "530",
    ue_value: "490",
    ve_value: "495",
    we_value: "500",
    remarks: "Excellent response",
    test_date: "2024-04-01",
    status: "Passed",
    tested_by: "Rajesh Kumar",
    created_by: 1
  },
  {
    id: 10,
    s_no: 10,
    equipment_name: "Workshop Panel Motor",
    kw_rating: "45 KW",
    uv_value: "300",
    vw_value: "295",
    wu_value: "305",
    ue_value: "280",
    ve_value: "285",
    we_value: "290",
    remarks: "Low values, awaiting approval",
    test_date: "2024-04-10",
    status: "Pending",
    tested_by: "Suresh Patel",
    created_by: 1
  }
];

export default function MotorMeggerTest({ user, onBack }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allTests, setAllTests] = useState([]);
  const [displayTests, setDisplayTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTests, setTotalTests] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [useDemoData, setUseDemoData] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const viewModalRef = useRef(null);
  const formModalRef = useRef(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    from_date: "",
    to_date: ""
  });

  // Form Data - EXACT IOCL MOTOR MEGGER FIELDS
  const [formData, setFormData] = useState({
    s_no: "",
    equipment_name: "",
    kw_rating: "",
    uv_value: "",
    vw_value: "",
    wu_value: "",
    ue_value: "",
    ve_value: "",
    we_value: "",
    remarks: "",
    test_date: "",
    status: "Passed",
    tested_by: "",
    created_by: 1
  });

  const statusOptions = ["Passed", "Failed", "Pending", "In Progress"];

  const getStatusColor = useCallback((status) => {
    switch(status) {
      case "Passed": return "bg-green-100 text-green-800 border-green-200";
      case "Failed": return "bg-red-100 text-red-800 border-red-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const getMeggerColor = useCallback((value) => {
    if (!value) return "";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "text-gray-600";
    if (numValue >= 500) return "text-green-600 font-bold";
    if (numValue >= 300) return "text-yellow-600 font-bold";
    return "text-red-600 font-bold";
  }, []);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (viewModalRef.current && !viewModalRef.current.contains(event.target) && showViewModal) {
        setShowViewModal(false);
        setSelectedTest(null);
      }
      if (formModalRef.current && !formModalRef.current.contains(event.target) && showForm) {
        setShowForm(false);
        setEditingId(null);
        resetForm();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showViewModal, showForm]);

  useEffect(() => {
    if (showViewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showViewModal]);

  // =============================================
  // FILTER & PAGINATE DATA
  // =============================================
  const filterAndPaginateData = useCallback(() => {
    let filtered = [...allTests];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.equipment_name?.toLowerCase().includes(term) ||
        t.kw_rating?.toLowerCase().includes(term) ||
        t.tested_by?.toLowerCase().includes(term)
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    
    if (filters.from_date) {
      filtered = filtered.filter(t => t.test_date >= filters.from_date);
    }
    
    if (filters.to_date) {
      filtered = filtered.filter(t => t.test_date <= filters.to_date);
    }
    
    setTotalTests(filtered.length);
    const pages = Math.ceil(filtered.length / itemsPerPage) || 1;
    setTotalPages(pages);
    
    if (currentPage > pages) {
      setCurrentPage(pages);
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filtered.slice(start, end);
    setDisplayTests(pageData);
    
  }, [allTests, searchTerm, filters, currentPage, itemsPerPage]);

  // =============================================
  // LOAD DEMO DATA
  // =============================================
  useEffect(() => {
    if (useDemoData) {
      setAllTests([...DEMO_TESTS]);
      setLoading(false);
    }
  }, [useDemoData]);

  useEffect(() => {
    if (allTests.length > 0) {
      filterAndPaginateData();
    }
  }, [allTests, searchTerm, filters, currentPage, itemsPerPage, filterAndPaginateData]);

  // =============================================
  // API SERVICE FUNCTIONS
  // =============================================
  const apiService = {
    fetchTests: async (page = 1, limit = 10) => {
      if (useDemoData) {
        return {
          status: true,
          tests: DEMO_TESTS,
          pagination: {
            total: DEMO_TESTS.length,
            totalPages: Math.ceil(DEMO_TESTS.length / limit),
            currentPage: page
          }
        };
      }
      
      let url = `${API_BASE}/motor-megger-tests?page=${page}&limit=${limit}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.from_date) url += `&from_date=${filters.from_date}`;
      if (filters.to_date) url += `&to_date=${filters.to_date}`;
      const res = await fetch(url);
      return res.json();
    },
    createTest: async (data) => {
      if (useDemoData) {
        const newTest = {
          id: DEMO_TESTS.length + 1,
          ...data,
          created_at: new Date().toISOString()
        };
        DEMO_TESTS.unshift(newTest);
        setAllTests([...DEMO_TESTS]);
        return { status: true, message: "Test added successfully", data: newTest };
      }
      const res = await fetch(`${API_BASE}/motor-megger-test/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    updateTest: async (id, data) => {
      if (useDemoData) {
        const index = DEMO_TESTS.findIndex(t => t.id === id);
        if (index !== -1) {
          DEMO_TESTS[index] = { ...DEMO_TESTS[index], ...data };
          setAllTests([...DEMO_TESTS]);
          return { status: true, message: "Test updated successfully" };
        }
        return { status: false, message: "Test not found" };
      }
      const res = await fetch(`${API_BASE}/motor-megger-test/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    deleteTest: async (id) => {
      if (useDemoData) {
        const index = DEMO_TESTS.findIndex(t => t.id === id);
        if (index !== -1) {
          DEMO_TESTS.splice(index, 1);
          setAllTests([...DEMO_TESTS]);
          return { status: true, message: "Test deleted successfully" };
        }
        return { status: false, message: "Test not found" };
      }
      const res = await fetch(`${API_BASE}/motor-megger-test/${id}`, { method: "DELETE" });
      return res.json();
    }
  };

  // =============================================
  // GET ALL ITEMS FOR EXPORT
  // =============================================
  const getAllItemsForExport = useCallback(async () => {
    if (useDemoData) {
      let filtered = [...DEMO_TESTS];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(t => 
          t.equipment_name?.toLowerCase().includes(term) ||
          t.kw_rating?.toLowerCase().includes(term) ||
          t.tested_by?.toLowerCase().includes(term)
        );
      }
      
      if (filters.status) {
        filtered = filtered.filter(t => t.status === filters.status);
      }
      
      if (filters.from_date) {
        filtered = filtered.filter(t => t.test_date >= filters.from_date);
      }
      
      if (filters.to_date) {
        filtered = filtered.filter(t => t.test_date <= filters.to_date);
      }
      
      return filtered;
    }
    
    try {
      const res = await fetch(`${API_BASE}/motor-megger-tests?page=1&limit=10000`);
      const data = await res.json();
      if (!data.status) {
        toast.error(data.message || "Failed to fetch data for export");
        return [];
      }
      let allItems = data.tests || [];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allItems = allItems.filter(t => 
          t.equipment_name?.toLowerCase().includes(term) ||
          t.kw_rating?.toLowerCase().includes(term) ||
          t.tested_by?.toLowerCase().includes(term)
        );
      }
      
      if (filters.status) {
        allItems = allItems.filter(t => t.status === filters.status);
      }
      
      if (filters.from_date) {
        allItems = allItems.filter(t => t.test_date >= filters.from_date);
      }
      
      if (filters.to_date) {
        allItems = allItems.filter(t => t.test_date <= filters.to_date);
      }
      
      return allItems;
    } catch (error) {
      console.error("Error fetching all items:", error);
      toast.error("Failed to fetch data for export");
      return [];
    }
  }, [searchTerm, filters, useDemoData]);

  // =============================================
  // EXPORT TO EXCEL
  // =============================================
  const exportToExcel = useCallback(async () => {
    try {
      setExportLoading(true);
      const data = await getAllItemsForExport();
      
      if (data.length === 0) {
        toast.error("No data to export");
        setExportLoading(false);
        return;
      }

      const wb = XLSX.utils.book_new();

      // Sheet 1: IOCL Format
      const excelData = data.map((item, index) => ({
        "S/No.": index + 1,
        "Equipment Name": item.equipment_name || "-",
        "KW Rating": item.kw_rating || "-",
        "UV": item.uv_value || "-",
        "VW": item.vw_value || "-",
        "WU": item.wu_value || "-",
        "UE": item.ue_value || "-",
        "VE": item.ve_value || "-",
        "WE": item.we_value || "-",
        "Remarks": item.remarks || ""
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
        { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 30 }
      ];
      XLSX.utils.book_append_sheet(wb, ws, "Motor Megger Tests");

      // Sheet 2: Status Summary
      const statusSummary = [
        { "Status": "Passed", "Count": data.filter(i => i.status === "Passed").length },
        { "Status": "Failed", "Count": data.filter(i => i.status === "Failed").length },
        { "Status": "Pending", "Count": data.filter(i => i.status === "Pending").length },
        { "Status": "In Progress", "Count": data.filter(i => i.status === "In Progress").length }
      ];

      const ws2 = XLSX.utils.json_to_sheet(statusSummary);
      ws2['!cols'] = [{ wch: 15 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, ws2, "Status Summary");

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `motor_megger_tests_${dayjs().format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} tests to Excel`);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export Excel");
    } finally {
      setExportLoading(false);
    }
  }, [getAllItemsForExport]);

  // =============================================
  // PRINT REPORT - EXACT IOCL FORMAT (as per image)
  // =============================================
  const printReport = useCallback(async () => {
    try {
      setExportLoading(true);
      const data = await getAllItemsForExport();
      
      if (data.length === 0) {
        toast.error("No data to print");
        setExportLoading(false);
        return;
      }

      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      if (!printWindow) {
        toast.error("Please allow popups to print");
        setExportLoading(false);
        return;
      }

      const today = dayjs().format("DD/MM/YYYY");
      const nextDueDate = dayjs().add(1, 'year').format("DD/MM/YYYY");

      const styles = `
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 10px 15px; 
            background: #fff;
            font-size: 10px;
          }
          .print-container {
            max-width: 1150px;
            margin: 0 auto;
            border: 2px solid #000;
            padding: 0;
            background: #fff;
          }
          
          /* Main Header Table */
          .main-header {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          .main-header td {
            border: 1px solid #000;
            padding: 5px 8px;
            vertical-align: middle;
          }
          .main-header .company-name {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
            width: 75%;
          }
          .main-header .right-label {
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            width: 25%;
          }
          .main-header .plant-name {
            text-align: center;
            font-size: 12px;
            font-weight: bold;
          }
          .main-header .page-label {
            text-align: left;
            font-size: 10px;
          }
          .main-header .report-title {
            text-align: center;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 0.5px;
          }
          
          /* Info Table */
          .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }
          .info-table td {
            border: 1px solid #000;
            padding: 5px 8px;
            vertical-align: middle;
          }
          .info-table .label-cell {
            font-weight: bold;
          }
          
          /* Data Table */
          .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }
          .data-table th, .data-table td {
            border: 1px solid #000;
            padding: 4px 5px;
            vertical-align: middle;
            text-align: center;
          }
          .data-table th {
            background: #fff;
            font-weight: bold;
            font-size: 9px;
          }
          .data-table td.left {
            text-align: left;
          }
          
          /* Notes Section */
          .notes-section {
            padding: 6px 10px;
            border-top: 1px solid #000;
            font-size: 9px;
          }
          .notes-section .note-item {
            padding: 2px 0;
          }
          .notes-section .note-item strong {
            font-weight: bold;
          }
          
          /* Contractor Section */
          .contractor-section {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }
          .contractor-section td {
            padding: 4px 10px;
            vertical-align: middle;
            border: none;
          }
          .contractor-section .label-cell {
            font-weight: bold;
            width: 15%;
          }
          
          /* Signature Section */
          .signature-section {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            margin-top: 30px;
          }
          .signature-section td {
            padding: 5px 10px;
            vertical-align: bottom;
            border: none;
          }
          .signature-section .left-sig {
            text-align: left;
          }
          .signature-section .right-sig {
            text-align: right;
          }
          
          @media print {
            body { padding: 5px 10px; }
            .main-header td, .info-table td, .data-table th, .data-table td {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      `;

      let html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Motor Megger Test Report</title>
            ${styles}
          </head>
          <body>
            <div class="print-container">
              
              <!-- MAIN HEADER - EXACT as per image -->
              <table class="main-header">
                <tr>
                  <td class="company-name">INDIAN OIL CORPORATION LIMITED</td>
                  <td class="right-label">Test Report</td>
                </tr>
                <tr>
                  <td class="plant-name">LPG BOTTLING PLANT</td>
                  <td class="page-label">Page No. :</td>
                </tr>
                <tr>
                  <td colspan="2" class="report-title">MOTOR MEGGER TEST</td>
                </tr>
              </table>

              <!-- INFO TABLE - EXACT as per image -->
              <table class="info-table">
                <tr>
                  <td style="width:45%;"><strong>MEGGER USED : (Capacity in volts)</strong></td>
                  <td style="width:25%;"><strong>Frequency :</strong> Yearly</td>
                  <td style="width:30%;"><strong>Test Date :</strong></td>
                </tr>
                <tr>
                  <td><strong>SR. NO. :</strong></td>
                  <td colspan="2"><strong>Next Due Date :</strong></td>
                </tr>
                <tr>
                  <td colspan="3"><strong>MAKE :</strong></td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Calibration Cert. No. &amp; Validity</strong></td>
                </tr>
              </table>

              <!-- DATA TABLE - EXACT as per image -->
              <table class="data-table">
                <thead>
                  <tr>
                    <th rowspan="2" style="width:5%;">S/No.</th>
                    <th rowspan="2" style="width:16%;">Equipment name</th>
                    <th rowspan="2" style="width:9%;">KW rating</th>
                    <th colspan="6" style="width:52%;">Value in mega ohms</th>
                    <th rowspan="2" style="width:18%;">Remarks</th>
                  </tr>
                  <tr>
                    <th style="width:8.66%;">U-V</th>
                    <th style="width:8.66%;">V-W</th>
                    <th style="width:8.66%;">W-U</th>
                    <th style="width:8.66%;">U-E</th>
                    <th style="width:8.66%;">V-E</th>
                    <th style="width:8.66%;">W-E</th>
                  </tr>
                </thead>
                <tbody>
      `;

      // Show data rows (max 20)
      const displayData = data.slice(0, 20);
      displayData.forEach((item, index) => {
        const rowNum = index + 1;
        html += `
          <tr>
            <td>${rowNum}</td>
            <td class="left">${item.equipment_name || ''}</td>
            <td>${item.kw_rating || ''}</td>
            <td>${item.uv_value || ''}</td>
            <td>${item.vw_value || ''}</td>
            <td>${item.wu_value || ''}</td>
            <td>${item.ue_value || ''}</td>
            <td>${item.ve_value || ''}</td>
            <td>${item.we_value || ''}</td>
            <td class="left">${item.remarks || ''}</td>
          </tr>
        `;
      });

      // Fill remaining rows up to 20
      if (data.length < 20) {
        for (let i = data.length + 1; i <= 20; i++) {
          html += `
            <tr>
              <td>${i}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `;
        }
      }

      html += `
                </tbody>
              </table>

              <!-- NOTES - EXACT as per image -->
              <div class="notes-section">
                <div class="note-item">
                  <strong>Note :</strong> Permit system as per OSD-105 revised to be followed.
                </div>
                <div class="note-item">
                  <strong>* If external Agency/Contractor is carrying out the testing.</strong>
                </div>
              </div>

              <!-- CONTRACTOR SECTION - EXACT as per image -->
              <table class="contractor-section">
                <tr>
                  <td class="label-cell">Testing Agency*</td>
                  <td></td>
                </tr>
                <tr>
                  <td class="label-cell">License No</td>
                  <td></td>
                </tr>
                <tr>
                  <td class="label-cell">Lic. Validity</td>
                  <td></td>
                </tr>
              </table>

              <!-- SIGNATURE SECTION - EXACT as per image -->
              <table class="signature-section">
                <tr>
                  <td class="left-sig">Seal &amp; Signature</td>
                  <td class="right-sig">IOCL Representative<br/>Name &amp; Designation</td>
                </tr>
              </table>

              <script>
                window.onload = function() { 
                  window.print(); 
                  window.onafterprint = function() { 
                    window.close(); 
                  };
                }
              <\/script>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      
      toast.success(`Printing ${data.length} tests`);
    } catch (error) {
      console.error("Error printing:", error);
      toast.error("Failed to print");
    } finally {
      setExportLoading(false);
    }
  }, [getAllItemsForExport, filters, searchTerm, user]);

  // =============================================
  // FORM HANDLERS
  // =============================================
  const resetForm = () => {
    setFormData({
      s_no: "",
      equipment_name: "",
      kw_rating: "",
      uv_value: "",
      vw_value: "",
      wu_value: "",
      ue_value: "",
      ve_value: "",
      we_value: "",
      remarks: "",
      test_date: "",
      status: "Passed",
      tested_by: user?.name || "",
      created_by: user?.id || 1
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openNewForm = () => {
    resetForm();
    const nextSNo = allTests.length > 0 ? Math.max(...allTests.map(t => t.s_no || 0)) + 1 : 1;
    setFormData(prev => ({ ...prev, s_no: nextSNo }));
    setShowForm(true);
  };

  const handleEdit = (test) => {
    setFormData({
      s_no: test.s_no || "",
      equipment_name: test.equipment_name || "",
      kw_rating: test.kw_rating || "",
      uv_value: test.uv_value || "",
      vw_value: test.vw_value || "",
      wu_value: test.wu_value || "",
      ue_value: test.ue_value || "",
      ve_value: test.ve_value || "",
      we_value: test.we_value || "",
      remarks: test.remarks || "",
      test_date: test.test_date ? dayjs(test.test_date).format("YYYY-MM-DD") : "",
      status: test.status || "Passed",
      tested_by: test.tested_by || user?.name || "",
      created_by: user?.id || 1
    });
    setEditingId(test.id);
    setShowForm(true);
    setShowViewModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.equipment_name) {
      toast.error("Equipment Name is required");
      return;
    }

    setActionLoading(true);

    try {
      const dataToSend = {
        ...formData,
        test_id: editingId ? undefined : generateTestId(),
        updated_by: user?.id || 1
      };

      let response;
      if (editingId) {
        response = await apiService.updateTest(editingId, dataToSend);
      } else {
        response = await apiService.createTest(dataToSend);
      }

      if (response.status) {
        toast.success(editingId ? "Test updated successfully" : "Test added successfully");
        setShowForm(false);
        resetForm();
      } else {
        toast.error(response.message || "Failed to save test");
      }
    } catch (error) {
      console.error("Error saving test:", error);
      toast.error("Failed to save test");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (test) => {
    if (!window.confirm(`Are you sure you want to delete this test record?`)) return;
    
    setActionLoading(true);

    try {
      const response = await apiService.deleteTest(test.id);
      if (response.status) {
        toast.success("Test deleted successfully");
        setShowViewModal(false);
        setSelectedTest(null);
      } else {
        toast.error(response.message || "Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("Failed to delete test");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  // =============================================
  // FILTER HANDLERS
  // =============================================
  const resetFilters = () => {
    setFilters({
      status: "",
      from_date: "",
      to_date: ""
    });
    setSearchTerm("");
    setCurrentPage(1);
    toast.info("All filters cleared");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // =============================================
  // HELPER FUNCTIONS
  // =============================================
  const generateTestId = () => {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `MMT${timestamp}${random}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return dayjs(date).format("DD/MM/YYYY");
  };

  // =============================================
  // PAGINATION
  // =============================================
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1.5 text-sm rounded transition cursor-pointer ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // =============================================
  // RENDER FORM - EXACT IOCL MOTOR MEGGER FIELDS
  // =============================================
  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingId ? "Edit Motor Megger Test" : "New Motor Megger Test"}
              </h1>
              <p className="text-gray-600 mt-1">
                {editingId ? "Update test information" : "Enter test details below"}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* S.No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <Hash className="w-4 h-4 text-blue-600" />
                      S.No.
                    </span>
                  </label>
                  <input 
                    type="number" 
                    name="s_no" 
                    value={formData.s_no} 
                    onChange={handleChange} 
                    placeholder="1" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400" 
                  />
                </div>

                {/* Equipment Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      Equipment Name <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input 
                    type="text" 
                    name="equipment_name" 
                    value={formData.equipment_name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Main Incomer Motor" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400" 
                  />
                </div>

                {/* KW Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                      KW Rating
                    </span>
                  </label>
                  <input 
                    type="text" 
                    name="kw_rating" 
                    value={formData.kw_rating} 
                    onChange={handleChange} 
                    placeholder="75 KW" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400" 
                  />
                </div>

                {/* Test Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Test Date
                    </span>
                  </label>
                  <input 
                    type="date" 
                    name="test_date" 
                    value={formData.test_date} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 cursor-pointer" 
                  />
                </div>
              </div>

              {/* Value in mega ohms section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-600" />
                  Value in mega ohms
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">U-V</label>
                    <input 
                      type="text" 
                      name="uv_value" 
                      value={formData.uv_value} 
                      onChange={handleChange} 
                      placeholder="0" 
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">V-W</label>
                    <input 
                      type="text" 
                      name="vw_value" 
                      value={formData.vw_value} 
                      onChange={handleChange} 
                      placeholder="0" 
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">W-U</label>
                    <input 
                      type="text" 
                      name="wu_value" 
                      value={formData.wu_value} 
                      onChange={handleChange} 
                      placeholder="0" 
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">U-E</label>
                    <input 
                      type="text" 
                      name="ue_value" 
                      value={formData.ue_value} 
                      onChange={handleChange} 
                      placeholder="0" 
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">V-E</label>
                    <input 
                      type="text" 
                      name="ve_value" 
                      value={formData.ve_value} 
                      onChange={handleChange} 
                      placeholder="0" 
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">W-E</label>
                    <input 
                      type="text" 
                      name="we_value" 
                      value={formData.we_value} 
                      onChange={handleChange} 
                      placeholder="0" 
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400 text-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Status
                    </span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none text-gray-700 cursor-pointer"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Tested By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4 text-blue-600" />
                      Tested By
                    </span>
                  </label>
                  <input 
                    type="text" 
                    name="tested_by" 
                    value={formData.tested_by} 
                    onChange={handleChange} 
                    placeholder="Name of tester" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400" 
                  />
                </div>

                {/* Remarks */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Remarks
                    </span>
                  </label>
                  <textarea 
                    name="remarks" 
                    value={formData.remarks} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Additional remarks" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder:text-gray-400 resize-none" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-sm cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {editingId ? "Update" : "Submit"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =============================================
  // MAIN RENDER
  // =============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Motor Megger Test</h1>
            <p className="text-gray-500 mt-1 text-sm flex items-center gap-2">
              Manage motor megger insulation test records
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {useDemoData ? "📊 Demo Data" : "🔗 API Connected"}
              </span>
            </p>
          </div>
          <button
            onClick={() => setUseDemoData(!useDemoData)}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {useDemoData ? "Switch to API" : "Switch to Demo"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Tests</p>
              <p className="text-2xl font-bold text-gray-800">{totalTests}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">📊</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {allTests.filter(t => t.status === "Passed").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">✅</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {allTests.filter(t => t.status === "Failed").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">❌</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {allTests.filter(t => t.status === "Pending" || t.status === "In Progress").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">⏳</div>
          </div>
        </div>
      </div>

      {/* Search, Filter and Refresh */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by equipment name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (useDemoData) {
                  setAllTests([...DEMO_TESTS]);
                  setCurrentPage(1);
                  toast.success("Data refreshed!");
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border rounded-xl transition-all duration-200 shadow-sm cursor-pointer ${
                showFilters 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{showFilters ? "Hide Filters" : "Filters"}</span>
            </button>

            {(filters.status || filters.from_date || filters.to_date || searchTerm) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <button 
              onClick={openNewForm} 
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Test
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="mb-6 p-4 md:p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-700">Filter Tests</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-700 bg-white cursor-pointer"
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">From Date</label>
              <input
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">To Date</label>
              <input
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Test Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 text-sm">Loading tests...</p>
        </div>
      ) : displayTests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-base text-gray-700 mb-2">No tests found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchTerm || Object.values(filters).some(f => f) 
              ? "Try adjusting your search or filters." 
              : "Add your first motor megger test to get started!"}
          </p>
          <button 
            onClick={openNewForm}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Test
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-gray-700">All Tests</h2>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {totalTests}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="text-xs border border-gray-300 rounded px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <span className="text-gray-300">|</span>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 mr-0.5">Export:</span>
                  <button
                    onClick={exportToExcel}
                    disabled={exportLoading || totalTests === 0}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Export Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={printReport}
                    disabled={exportLoading || totalTests === 0}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Print"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  {exportLoading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1400px]">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th rowSpan={2} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">S/No.</th>
                    <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Equipment Name</th>
                    <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">KW Rating</th>
                    <th colSpan={6} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 border-b border-gray-200">Value in mega ohms</th>
                    <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Status</th>
                    <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                  <tr>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">U-V</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">V-W</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">W-U</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">U-E</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">V-E</th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">W-E</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {displayTests.map((test, index) => {
                    const sequentialNumber = ((currentPage - 1) * itemsPerPage) + index + 1;
                    
                    return (
                      <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 whitespace-nowrap text-center border-r border-gray-100">
                          <span className="text-sm text-gray-500">{test.s_no || sequentialNumber}</span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap border-r border-gray-100">
                          <div className="text-sm font-medium text-gray-700">{test.equipment_name || "-"}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap border-r border-gray-100">
                          <span className="text-sm text-gray-600">{test.kw_rating || "-"}</span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-center border-r border-gray-100">
                          <span className={`text-sm ${getMeggerColor(test.uv_value)}`}>{test.uv_value || "—"}</span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-center border-r border-gray-100">
                          <span className={`text-sm ${getMeggerColor(test.vw_value)}`}>{test.vw_value || "—"}</span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-center border-r border-gray-100">
                          <span className={`text-sm ${getMeggerColor(test.wu_value)}`}>{test.wu_value || "—"}</span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-center border-r border-gray-100">
                          <span className={`text-sm ${getMeggerColor(test.ue_value)}`}>{test.ue_value || "—"}</span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-center border-r border-gray-100">
                          <span className={`text-sm ${getMeggerColor(test.ve_value)}`}>{test.ve_value || "—"}</span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-center border-r border-gray-100">
                          <span className={`text-sm ${getMeggerColor(test.we_value)}`}>{test.we_value || "—"}</span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap border-r border-gray-100">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => {
                                setSelectedTest(test);
                                setShowViewModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                              title="View Details"
                              disabled={actionLoading}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(test)}
                              className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                              disabled={actionLoading}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(test)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                              disabled={actionLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">
                    {totalTests === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}
                  </span> to{" "}
                  <span className="font-medium text-gray-900">
                    {Math.min(currentPage * itemsPerPage, totalTests)}
                  </span> of{" "}
                  <span className="font-medium text-gray-900">{totalTests}</span> tests
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {renderPagination()}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={viewModalRef} className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Motor Megger Test Details</h2>
                  <p className="text-sm text-gray-500">
                    {selectedTest.equipment_name || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => { setShowViewModal(false); setSelectedTest(null); }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Test Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">S.No.</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTest.s_no || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Equipment Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTest.equipment_name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">KW Rating</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTest.kw_rating || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tested By</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTest.tested_by || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTest.status)}`}>
                        {selectedTest.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Test Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(selectedTest.test_date)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Value in mega ohms</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">U-V</p>
                      <p className={`text-sm font-medium ${getMeggerColor(selectedTest.uv_value)}`}>{selectedTest.uv_value || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">V-W</p>
                      <p className={`text-sm font-medium ${getMeggerColor(selectedTest.vw_value)}`}>{selectedTest.vw_value || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">W-U</p>
                      <p className={`text-sm font-medium ${getMeggerColor(selectedTest.wu_value)}`}>{selectedTest.wu_value || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">U-E</p>
                      <p className={`text-sm font-medium ${getMeggerColor(selectedTest.ue_value)}`}>{selectedTest.ue_value || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">V-E</p>
                      <p className={`text-sm font-medium ${getMeggerColor(selectedTest.ve_value)}`}>{selectedTest.ve_value || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">W-E</p>
                      <p className={`text-sm font-medium ${getMeggerColor(selectedTest.we_value)}`}>{selectedTest.we_value || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTest.remarks && (
                <>
                  <hr className="my-6" />
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Remarks</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTest.remarks}</p>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => { setShowViewModal(false); setSelectedTest(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleEdit(selectedTest)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}