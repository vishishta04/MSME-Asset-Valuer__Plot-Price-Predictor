# MSME-Asset-Valuer__Plot-Price-Predictor
MSME Asset Valuer helps small businesses assess property values with AI-driven insights, market trends, and price comparisons, empowering smarter real estate decisions for MSMEs. 🚀

# Demo 
![image](https://github.com/user-attachments/assets/2cc66c33-197d-4ace-82f6-bcbaa4983c7d)

## Project Structure  

```
PLOT_PRICE_PREDICTOR/  
│  
├── backend/  
│   ├── app.py  
│   ├── train_model.py  
│   ├── filtered_housing_data.csv  
│   ├── model.pkl  
│   ├── requirements.txt  
│  
├── originaldata_datacleaning/  
│   ├── Bengaluru_House_Data(Original_Data).csv  
│   ├── DataCleaning_ModelBuilding.ipynb  
│  
├── static/  
│   ├── script.js  
│   ├── styles.css  
│  
├── templates/  
│   ├── index.html  
```

## Installation  

1. Clone the repository:  
   ```sh
   git clone https://github.com/my-repo-link.git
   cd PLOT_PRICE_PREDICTOR
   ```  
2. Install dependencies:  
   ```sh
   pip install -r backend/requirements.txt
   ```  
3. Run the Flask app:  
   ```sh
   python backend/app.py
   ```  

## Features  

### **Current Features:**  
✅ **Market Overview:** Displays total properties, average price, average area, and most popular BHK size.  
✅ **Real-time Price Prediction:** Input location, BHK, bathrooms, and area to predict house prices.  
✅ **Market Comparison:** Compares predicted price with location averages.  
✅ **Property Size Distribution:** Graphical representation of different BHK distributions.  
✅ **Price Analysis:** Price trend visualization.  
✅ **Modern UI:** Dark theme with interactive elements for a better user experience.  

### **Future Enhancements:**  
🔹 **Advanced Model:** Improve prediction accuracy with more ML algorithms.  
🔹 **Dynamic Market Data:** Integrate real-time property price updates.  
🔹 **User Authentication:** Allow users to save and compare searches.  
🔹 **Map Integration:** Show property locations on an interactive map.  
🔹 **PDF Report Generation:** Generate downloadable property valuation reports.  

## References  

- **Flask Documentation** - [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)  
- **Pandas & NumPy** - [https://pandas.pydata.org/](https://pandas.pydata.org/)  
- **Matplotlib & Seaborn** for visualizations  
- **Claude.ai** for enhancing UI design & fixing errors (Really Helpful)

## Contributions  

Contributions are welcome! Feel free to raise issues or submit pull requests.  

🚀 **Built for MSMEs to simplify property valuation!**  




